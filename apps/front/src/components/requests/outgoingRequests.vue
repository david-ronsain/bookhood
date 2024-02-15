<script setup lang="ts">
	import { BhCard, BhDatatable } from '@bookhood/ui'
	import { type IRequestList, RequestStatus } from '@bookhood/shared'
	import { useRequestStore, useMainStore } from '../../store'
	import { onMounted, onUnmounted } from 'vue'
	import { ref } from 'vue'
	import ReceivedRequestDialog from '../dialogs/request/receivedRequestDialog.vue'
	import NeverReceivedRequestDialog from '../dialogs/request/neverReceivedRequestDialog.vue'
	import ReturnedRequestDialog from '../dialogs/request/returnedRequestDialog.vue'
	import BtnValidateStatus from './actions/btnValidateStatus.vue'
	import BtnRefuseStatus from './actions/btnRefuseStatus.vue'
	import BtnOtherAction from './actions/btnOtherAction.vue'

	import { useI18n } from 'vue-i18n'
	import { mdiChat } from '@mdi/js'
	import { computed } from 'vue'
	import { watch } from 'vue'
	import { statusColor } from '../../composables/statusColor.composable'

	const { t } = useI18n({})
	const mainStore = useMainStore()
	const requestStore = useRequestStore()
	const loading = ref<boolean>(false)
	const receivedRequestDialog = ref<typeof ReceivedRequestDialog | null>()
	const neverReceivedRequestDialog = ref<
		typeof NeverReceivedRequestDialog | null
	>()
	const returnedRequestDialog = ref<typeof ReturnedRequestDialog | null>()
	const headers = [
		{
			align: 'center',
			sortable: false,
			title: t('request.headers.book'),
			key: 'title',
		},
		{
			align: 'center',
			sortable: false,
			title: t('request.headers.firstName'),
			key: 'firstName',
		},
		{
			align: 'center',
			sortable: false,
			title: t('request.headers.status'),
			key: 'status',
		},
		{
			align: 'center',
			sortable: false,
			title: t('request.headers.date'),
			key: 'createdAt',
		},
		{
			align: 'center',
			sortable: false,
			title: t('request.headers.actions'),
			key: '',
		},
	]

	const profile = computed(() => mainStore.profile)

	watch(profile, () => {
		loadRequests()
	})

	onMounted(() => {
		loadRequests()
	})

	onUnmounted(() => {
		requestStore.$patch({
			outgoingRequests: { total: 0, results: [] } as IRequestList,
			outgoingRequestPage: 0,
		})
	})

	const loadRequests = () => {
		if (profile.value) {
			loading.value = true
			requestStore
				.getOutgoingRequests({ userId: profile.value?._id })
				.then(() => {
					loading.value = false
				})
		}
	}

	const received = (requestId: string) => {
		receivedRequestDialog.value.open(requestId)
	}

	const neverReceived = (requestId: string) => {
		neverReceivedRequestDialog.value.open(requestId)
	}

	const returned = (requestId: string) => {
		returnedRequestDialog.value.open(requestId)
	}

	const chat = (libraryId: string) => {
		console.log(`chat ${libraryId}`)
	}
</script>

<template>
	<bh-card
		flat
		border
		:hover="false"
		:title="$t('request.outgoing.title')">
		<template v-slot:text>
			<bh-datatable
				:headers="headers"
				:items="requestStore.outgoingRequests.results"
				:loading="loading"
				:loading-text="$t('request.loading')"
				:no-data-text="$t('request.noData')"
				:page="requestStore.outgoingRequestPage"
				@update:page="loadRequests">
				<template v-slot:item="{ item }">
					<tr>
						<td>{{ item.title }}</td>
						<td>{{ item.ownerFirstName }}</td>
						<td>
							<v-chip
								density="compact"
								pill
								:color="statusColor(item.status)"
								>{{
									$t('request.status.' + item.status)
								}}</v-chip
							>
						</td>
						<td>{{ item.createdAt }}</td>
						<td>
							<div class="d-flex align-center justify-center">
								<btn-validate-status
									v-if="
										item.status ===
											RequestStatus.ACCEPTED_PENDING_DELIVERY ||
										item.status ===
											RequestStatus.NEVER_RECEIVED
									"
									:tooltip="$t('request.tooltips.received')"
									@status:validated="received(item._id)" />

								<btn-validate-status
									v-else-if="
										item.status === RequestStatus.RECEIVED
									"
									:tooltip="$t('request.tooltips.returned')"
									@status:validated="returned(item._id)" />

								<btn-refuse-status
									v-if="
										item.status ===
										RequestStatus.ACCEPTED_PENDING_DELIVERY
									"
									:tooltip="
										$t('request.tooltips.neverReceived')
									"
									@status:refused="neverReceived(item._id)" />

								<btn-other-action
									v-if="false"
									:tooltip="$t('request.tooltips.chat')"
									:icon="mdiChat"
									@clicked="chat(item._id)" />
							</div>
						</td>
					</tr>
				</template>
			</bh-datatable>
			<received-request-dialog ref="receivedRequestDialog" />
			<never-received-request-dialog ref="neverReceivedRequestDialog" />
			<returned-request-dialog ref="returnedRequestDialog" />
		</template>
	</bh-card>
</template>
