<script setup lang="ts">
	import { BhCard, BhDatatable } from '@bookhood/ui'
	import { useRequestStore } from '../../../../../store'
	import { onMounted } from 'vue'
	import { ref } from 'vue'
	import { type IRequestSimple, type IRequestList } from '@bookhood/shared'
	import AcceptRequestDialog from '../../../../dialogs/request/acceptRequestDialog.vue'
	import RefuseRequestDialog from '../../../../dialogs/request/refuseRequestDialog.vue'

	import { useI18n } from 'vue-i18n'
	import { mdiChat, mdiCheck, mdiClose } from '@mdi/js'

	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const loading = ref<boolean>(false)
	const acceptRequestDialog = ref<typeof AcceptRequestDialog | null>()
	const refuseRequestDialog = ref<typeof RefuseRequestDialog | null>()
	const pendingRequestsHeaders = [
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooksLent.requests.headers.book'),
			key: 'title',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooksLent.requests.headers.firstName'),
			key: 'firstName',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooksLent.requests.headers.date'),
			key: 'createdAt',
		},
		{
			align: 'center',
			sortable: false,
			title: t('account.books.yourBooksLent.requests.headers.actions'),
			key: '',
		},
	]

	onMounted(() => {
		loadPendingRequest()
	})

	const loadPendingRequest = () => {
		loading.value = true
		requestStore.getPending().then(() => {
			loading.value = false
		})
	}

	const accept = (requestId: string) => {
		acceptRequestDialog.value.open(requestId)
	}

	const refuse = (requestId: string) => {
		refuseRequestDialog.value.open(requestId)
	}

	const chat = (libraryId: string) => {
		console.log(`chat ${libraryId}`)
	}
</script>

<template>
	<v-row>
		<v-col
			cols="12"
			md="6">
			<bh-card
				flat
				border
				:hover="false"
				:title="$t('account.books.yourBooksLent.requests.title')">
				<template v-slot:text>
					<bh-datatable
						:headers="pendingRequestsHeaders"
						:items="requestStore.pendingRequests.results"
						:loading="loading"
						:loading-text="
							$t('account.books.yourBooksLent.requests.loading')
						"
						:no-data-text="
							$t('account.books.yourBooksLent.requests.noData')
						"
						:page="requestStore.pendingRequestPage"
						@update:page="loadPendingRequest">
						<template v-slot:item="{ item }">
							<tr>
								<td>{{ item.title }}</td>
								<td>{{ item.firstName }}</td>
								<td>{{ item.createdAt }}</td>
								<td class="d-flex align-center justify-center">
									<v-btn
										class="mr-2"
										icon
										size="20"
										color="green"
										@click="accept(item._id)">
										<v-icon
											size="20"
											color="white">
											{{ mdiCheck }}
										</v-icon>
									</v-btn>
									<v-btn
										class="mr-2"
										size="20"
										icon
										color="primary"
										@click="refuse(item._id)">
										<v-icon
											size="20"
											color="white">
											{{ mdiClose }}
										</v-icon>
									</v-btn>
									<v-btn
										v-if="false"
										size="20"
										icon
										color="info"
										@click="chat(item._id)">
										<v-icon
											size="20"
											color="white">
											{{ mdiChat }}
										</v-icon>
									</v-btn>
								</td>
							</tr>
						</template>
					</bh-datatable>
					<accept-request-dialog ref="acceptRequestDialog" />
					<refuse-request-dialog ref="refuseRequestDialog" />
				</template>
			</bh-card>
		</v-col>
		<v-col
			cols="12"
			md="6">
		</v-col>
	</v-row>
</template>
