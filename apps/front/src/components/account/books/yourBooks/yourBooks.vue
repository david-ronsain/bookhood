<script setup lang="ts">
	import { mdiPlusCircleOutline } from '@mdi/js'
	import { ref } from 'vue'
	import CreateBookDialog from '../../../dialogs/book/createBookDialog.vue'
	import { BhPrimaryButton, BhCard, BhDatatable } from '@bookhood/ui'
	import {
		LibraryStatus,
		type IBooksListResult,
		RequestStatus,
	} from '@bookhood/shared'
	import { useMainStore, useAccountStore } from '../../../../store'
	import { onMounted } from 'vue'
	import { useI18n } from 'vue-i18n'
	import { useStatusColor } from '../../../../composables/statusColor.composable'
	import { computed, watch, defineExpose } from 'vue'

	const statusColor = useStatusColor()
	const { t } = useI18n({})
	const mainStore = useMainStore()
	const accountStore = useAccountStore()
	const addDialog = ref(null)
	const tempStatus = ref<RequestStatus>(RequestStatus.NONE)

	const libraryStatus = Object.values(LibraryStatus).map(
		(status: LibraryStatus) => ({
			title: t('account.books.yourBooks.list.statusNames.' + status),
			value: status,
		}),
	)

	const headers = [
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooks.list.book'),
			key: 'title',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooks.list.authors'),
			key: 'authors',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooks.list.category'),
			key: 'category',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooks.list.status'),
			key: 'status',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooks.list.currentStatus'),
			key: 'currentStatus',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooks.list.place'),
			key: 'place',
		},
		/*{
				align: 'center',
				sortable: false,
				title: t('account.books.yourBooks.list.actions'),
				key: '',
			},*/
	]

	const profile = computed(() => mainStore.profile)
	const books = computed(() => accountStore.books)
	const page = computed(() => accountStore.booksPage)
	const loading = computed(() => accountStore.booksLoading)

	watch(profile, () => {
		loadBooks()
	})

	onMounted(() => {
		loadBooks()
	})

	const loadBooks = () => {
		if (profile.value) {
			accountStore.loadBooks(profile.value._id)
		}
	}

	const edit = (item?: IBooksListResult) => {
		accountStore.$patch({
			books: books.value.map((book: IBooksListResult) => ({
				...book,
				editing: false,
			})),
		})
		if (item) {
			tempStatus.value = item.status
			books.value.forEach((book: IBooksListResult, index: number) => {
				if (item._id === book._id) {
					books.value[index].editing = true
				}
			})
		}
	}

	const saveStatus = (item: IBooksListResult, value: RequestStatus) => {
		books.value.forEach((book: IBooksListResult, index: number) => {
			if (item._id === book._id) {
				accountStore
					.updateBookStatus(item._id, value)
					.then(() => {
						mainStore.$patch({
							success: t(
								'account.books.yourBooks.list.patch.success',
							),
						})
						books.value[index].status = value
					})
					.catch(() => {
						mainStore.$patch({
							error: t(
								'account.books.yourBooks.list.patch.error',
							),
						})
					})
			}
		})
		tempStatus.value = RequestStatus.NONE
		edit()
	}

	const changeMenuStatus = (value) => {
		if (!value) {
			edit()
		}
	}

	defineExpose({ loadBooks })
</script>

<template>
	<div>
		<div class="d-flex align-center justify-end">
			<bh-primary-button
				class="add-book"
				:text="$t('account.books.yourBooks.add')"
				:icon="{ icon: mdiPlusCircleOutline, prepend: true }"
				@click="addDialog.open()" />
		</div>

		<v-row>
			<v-col
				cols="12"
				md="6">
				<bh-card
					flat
					border
					:hover="false"
					:title="$t('account.books.yourBooks.list.title')">
					<template v-slot:text>
						<bh-datatable
							class="your-books-list"
							:headers="headers"
							:items="books"
							:loading="loading"
							:loading-text="
								$t('account.books.yourBooks.list.loading')
							"
							:no-data-text="
								$t('account.books.yourBooks.list.noData')
							"
							:page="page"
							@update:page="books">
							<template v-slot:item="{ item }">
								<tr>
									<td>{{ item.title }}</td>
									<td>{{ item.authors.join(', ') }}</td>
									<td>{{ item.categories.join(', ') }}</td>
									<td
										@dblclick="
											edit(
												item.editing ? undefined : item,
											)
										">
										<div
											v-if="!!item.editing"
											class="d-flex">
											<v-select
												density="compact"
												hide-details
												:items="libraryStatus"
												:model-value="tempStatus"
												variant="outlined"
												@update:menu="changeMenuStatus"
												@update:model-value="
													(event) =>
														saveStatus(item, event)
												" />
										</div>
										<v-chip
											v-else
											density="compact"
											pill
											:color="
												statusColor.library(item.status)
											"
											>{{
												$t(
													'account.books.yourBooks.list.statusNames.' +
														item.status,
												)
											}}</v-chip
										>
									</td>
									<td>
										<v-chip
											v-if="item.currentStatus"
											density="compact"
											pill
											:color="
												statusColor.request(
													item.currentStatus,
												)
											"
											>{{
												$t(
													'request.status.' +
														item.currentStatus,
												)
											}}</v-chip
										>
									</td>
									<td>{{ item.place }}</td>
									<!--<td>
										<div
											class="d-flex align-center justify-center"></div>
									</td>-->
								</tr>
							</template>
						</bh-datatable>
					</template>
				</bh-card>
			</v-col>
		</v-row>

		<create-book-dialog
			class="add-book-dialog"
			ref="addDialog"
			@bookCreated="loadBooks" />
	</div>
</template>
