<script setup lang="ts">
	import { BhCard, BhDatatable } from '@bookhood/ui'
	import {
		type IRequestList,
		RequestStatus,
		type IRequestSimple,
	} from '@bookhood/shared'
	import { useRequestStore, useMainStore } from '../../store'
	import { onMounted } from 'vue'
	import { ref } from 'vue'
	import AcceptRequestDialog from '../dialogs/request/acceptRequestDialog.vue'
	import RefuseRequestDialog from '../dialogs/request/refuseRequestDialog.vue'
	import AcceptReturnRequestDialog from '../dialogs/request/acceptReturnRequestDialog.vue'
	import RefuseReturnRequestDialog from '../dialogs/request/refuseReturnRequestDialog.vue'
	import IssueFixedRequestDialog from '../dialogs/request/issueFixedRequestDialog.vue'
	import BtnValidateStatus from './actions/btnValidateStatus.vue'
	import BtnRefuseStatus from './actions/btnRefuseStatus.vue'
	import BtnOtherAction from './actions/btnOtherAction.vue'
	import { useRouter } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { mdiChat } from '@mdi/js'
	import { onUnmounted } from 'vue'
	import { computed } from 'vue'
	import { watch } from 'vue'
	import { statusColor } from '../../composables/statusColor.composable'
	import { useDate } from 'vuetify'

	const date = useDate()
	const router = useRouter()
	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const loading = ref<boolean>(false)
	const acceptRequestDialog = ref<typeof AcceptRequestDialog | null>()
	const refuseRequestDialog = ref<typeof RefuseRequestDialog | null>()
	const acceptReturnRequestDialog = ref<
		typeof AcceptReturnRequestDialog | null
	>()
	const refuseReturnRequestDialog = ref<
		typeof RefuseReturnRequestDialog | null
	>()
	const issueFixedRequestDialog = ref<typeof IssueFixedRequestDialog | null>()
	const pendingRequestsHeaders = [
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
		loadPendingRequests()
	})

	onMounted(() => {
		loadPendingRequests()
	})

	onUnmounted(() => {
		requestStore.$patch({
			incomingRequests: { total: 0, results: [] } as IRequestList,
			incomingRequestPage: 1,
		})
	})

	const loadPendingRequests = () => {
		if (profile.value) {
			loading.value = true
			requestStore
				.getIncomingRequests({
					ownerId: profile.value?._id,
				})
				.then(() => {
					loading.value = false
				})
		}
	}

	const accept = (requestId: string, startDate: string, endDate: string) => {
		acceptRequestDialog.value.open(requestId, startDate, endDate)
	}

	const refuse = (requestId: string) => {
		refuseRequestDialog.value.open(requestId)
	}

	const acceptReturn = (requestId: string) => {
		acceptReturnRequestDialog.value.open(requestId)
	}

	const refuseReturn = (requestId: string) => {
		refuseReturnRequestDialog.value.open(requestId)
	}

	const issueFixed = (requestId: string) => {
		issueFixedRequestDialog.value.open(requestId)
	}

	const chat = (requestId: string) => {
		router.push({
			name: 'conversation',
			params: { id: requestId },
		})
	}

	const validateStatus = (item: IRequestSimple) => {
		if (item.status === RequestStatus.PENDING_VALIDATION) {
			accept(item._id, item.startDate, item.endDate)
		} else if (item.status === RequestStatus.RETURN_PENDING) {
			acceptReturn(item._id)
		} else if (item.status === RequestStatus.RETURNED_WITH_ISSUE) {
			issueFixed(item._id)
		}
	}

	const validateBtnText = (status: RequestStatus): string => {
		if (status === RequestStatus.PENDING_VALIDATION) {
			return t('request.tooltips.accept')
		} else if (status === RequestStatus.RETURN_PENDING) {
			return t('request.tooltips.acceptReturn')
		} else if (status === RequestStatus.RETURNED_WITH_ISSUE) {
			return t('request.tooltips.issueFixed')
		}
		return ''
	}
	const showValidateBtn = (status: RequestStatus): boolean =>
		[
			RequestStatus.PENDING_VALIDATION,
			RequestStatus.RETURN_PENDING,
			RequestStatus.RETURNED_WITH_ISSUE,
		].includes(status)

	const refuseStatus = (id: string, status: RequestStatus) => {
		if (status === RequestStatus.PENDING_VALIDATION) {
			refuse(id)
		} else if (status === RequestStatus.RETURN_PENDING) {
			refuseReturn(id)
		}
	}

	const refuseBtnText = (status: RequestStatus): string => {
		if (status === RequestStatus.PENDING_VALIDATION) {
			return t('request.tooltips.refuse')
		} else if (status === RequestStatus.RETURN_PENDING) {
			return t('request.tooltips.refuseReturn')
		}
		return ''
	}
	const showRefuseBtn = (status: RequestStatus): boolean =>
		[
			RequestStatus.PENDING_VALIDATION,
			RequestStatus.RETURN_PENDING,
		].includes(status)
</script>

<template>
	<bh-card
		flat
		border
		:hover="false"
		:title="$t('request.incoming.title')">
		<template v-slot:text>
			<bh-datatable
				:headers="pendingRequestsHeaders"
				:items="requestStore.incomingRequests.results"
				:loading="loading"
				:loading-text="$t('request.loading')"
				:no-data-text="$t('request.noData')"
				:page="requestStore.incomingRequestPage"
				@update:page="loadPendingRequests">
				<template v-slot:item="{ item }">
					<tr>
						<td>{{ item.title }}</td>
						<td>{{ item.userFirstName }}</td>
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
									@status:validated="validateStatus(item)" />

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
			<accept-request-dialog ref="acceptRequestDialog" />
			<refuse-request-dialog ref="refuseRequestDialog" />
			<accept-return-request-dialog ref="acceptReturnRequestDialog" />
			<refuse-return-request-dialog ref="refuseReturnRequestDialog" />
			<issue-fixed-request-dialog ref="issueFixedRequestDialog" />
		</template>
	</bh-card>
</template>
