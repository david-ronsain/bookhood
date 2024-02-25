<script setup lang="ts">
	import { BhCard, BhDatatable } from '@bookhood/ui'
	import { useI18n } from 'vue-i18n'
	import { useProfileStore } from '../../store'
	import { useRoute } from 'vue-router'
	import { onMounted, onUnmounted, computed } from 'vue'
	import { libraryStatusColor } from '../../composables/statusColor.composable'

	const route = useRoute()
	const profileStore = useProfileStore()
	const { t } = useI18n({})
	const headers = [
		{
			align: 'center',
			sortable: false,
			title: t('profile.books.list.book'),
			key: 'title',
		},
		{
			align: 'center',
			sortable: false,
			title: t('profile.books.list.author'),
			key: 'authors',
		},
		{
			align: 'center',
			sortable: false,
			title: t('profile.books.list.description'),
			key: 'description',
		},
		{
			align: 'center',
			sortable: false,
			title: t('profile.books.list.status'),
			key: 'status',
		},
		{
			align: 'center',
			sortable: false,
			title: t('profile.books.list.actions'),
			key: '',
		},
	]

	const items = computed(() => profileStore.booksList)
	const loading = computed(() => profileStore.booksListLoading)
	const total = computed(() => profileStore.booksListTotal)
	const page = computed({
		get() {
			return profileStore.booksListPage
		},
		set(val: number) {
			profileStore.$patch({ booksListPage: val })
		},
	})

	const load = (): void => {
		profileStore.loadBooks(route.params.userId.toString())
	}

	onMounted(() => {
		load()
	})

	onUnmounted(() => {
		profileStore.$patch({
			booksListPage: 1,
			booksListLoading: false,
			booksListTotal: 0,
			booksList: [],
		})
	})
</script>

<template>
	<bh-card
		border
		flat
		:hover="false"
		:title="$t('profile.books.list.title')">
		<template v-slot:text>
			<bh-datatable
				:headers="headers"
				:items="items"
				:loading="loading"
				:loading-text="$t('profile.books.list.loading')"
				:no-data-text="$t('profile.books.list.noData')"
				:page="page"
				@update:page="load">
				<template v-slot:item="{ item }">
					<tr>
						<td>{{ item.title }}</td>
						<td>{{ item.authors.join(', ') }}</td>
						<td>
							<div
								:data-data="!!item.expand"
								@click="item.expand = !item.expand">
								<span
									v-if="!item.expand"
									v-text="item.description.substring(0, 100)">
								</span>
								<span
									v-if="
										!item.expand &&
										item.description.length > 100
									"
									>...</span
								>
								<span
									v-else-if="item.expand"
									v-text="item.description"></span>
							</div>
						</td>
						<td>
							<v-chip
								density="compact"
								pill
								:color="libraryStatusColor(item.status)"
								>{{
									$t('profile.books.list.' + item.status)
								}}</v-chip
							>
						</td>
						<td>
							<div
								class="d-flex align-center justify-center"></div>
						</td>
					</tr>
				</template>
			</bh-datatable>
		</template>
	</bh-card>
</template>
