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
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { mdiChat } from '@mdi/js'
	import { computed, watch } from 'vue'
	import { statusColor } from '../../composables/statusColor.composable'
	import { useDate } from 'vuetify'

	const date = useDate()
	const router = useRouter()
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
			title: t('request.headers.startDate'),
			key: 'startDate',
		},
		{
			align: 'center',
			sortable: false,
			title: t('request.headers.endDate'),
			key: 'endDate',
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
			outgoingRequestPage: 1,
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

	const chat = (requestId: string) => {
		router.push({
			name: 'conversation',
			params: { id: requestId },
		})
	}

	const validateStatus = (id: string, status: RequestStatus) => {
		if (
			status === RequestStatus.ACCEPTED_PENDING_DELIVERY ||
			status === RequestStatus.NEVER_RECEIVED
		) {
			received(id)
		} else if (status === RequestStatus.RECEIVED) {
			returned(id)
		}
	}

	const validateBtnText = (status: RequestStatus): string => {
		if (
			status === RequestStatus.ACCEPTED_PENDING_DELIVERY ||
			status === RequestStatus.NEVER_RECEIVED
		) {
			return t('request.tooltips.received')
		} else if (status === RequestStatus.RECEIVED) {
			return t('request.tooltips.returned')
		}
		return ''
	}

	const showValidateBtn = (status: RequestStatus): boolean =>
		[
			RequestStatus.ACCEPTED_PENDING_DELIVERY,
			RequestStatus.NEVER_RECEIVED,
			RequestStatus.RECEIVED,
		].includes(status)

	const refuseStatus = (id: string, status: RequestStatus) => {
		if (status === RequestStatus.ACCEPTED_PENDING_DELIVERY) {
			neverReceived(id)
		}
	}

	const refuseBtnText = (status: RequestStatus): string => {
		if (status === RequestStatus.ACCEPTED_PENDING_DELIVERY) {
			return t('request.tooltips.neverReceived')
		}
		return ''
	}
	const showRefuseBtn = (status: RequestStatus): boolean =>
		[RequestStatus.ACCEPTED_PENDING_DELIVERY].includes(status)
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
						<td>
							{{ date.format(item.startDate, 'keyboardDate') }}
						</td>
						<td>{{ date.format(item.endDate, 'keyboardDate') }}</td>
						<td>
							<div class="d-flex align-center justify-center">
								<btn-validate-status
									v-if="showValidateBtn(item.status)"
									:tooltip="validateBtnText(item.status)"
									@status:validated="
										validateStatus(item.id, item.status)
									" />

								<btn-refuse-status
									v-if="showRefuseBtn(item.status)"
									:tooltip="refuseBtnText(item.status)"
									@status:refused="
										refuseStatus(item.id, item.status)
									" />

								<btn-other-action
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
