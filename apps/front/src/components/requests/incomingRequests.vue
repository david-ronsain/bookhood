<script setup lang="ts">
	import { BhCard, BhDatatable } from '@bookhood/ui'
	import { type IRequestList, RequestStatus } from '@bookhood/shared'
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
		loadPendingRequests()
	})

	onMounted(() => {
		loadPendingRequests()
	})

	onUnmounted(() => {
		requestStore.$patch({
			incomingRequests: { total: 0, results: [] } as IRequestList,
			incomingRequestPage: 0,
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

	const accept = (requestId: string) => {
		acceptRequestDialog.value.open(requestId)
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
						<td>{{ item.createdAt }}</td>
						<td>
							<div class="d-flex align-center justify-center">
								<btn-validate-status
									v-if="
										item.status ===
										RequestStatus.PENDING_VALIDATION
									"
									:tooltip="$t('request.tooltips.received')"
									@status:validated="accept(item._id)" />
								<btn-validate-status
									v-else-if="
										item.status ===
										RequestStatus.RETURN_PENDING
									"
									:tooltip="
										$t('request.tooltips.acceptReturn')
									"
									@status:validated="
										acceptReturn(item._id)
									" />
								<btn-validate-status
									v-else-if="
										item.status ===
										RequestStatus.RETURNED_WITH_ISSUE
									"
									:tooltip="$t('request.tooltips.issueFixed')"
									@status:validated="issueFixed(item._id)" />

								<btn-refuse-status
									v-if="
										item.status ===
										RequestStatus.PENDING_VALIDATION
									"
									:tooltip="
										$t('request.tooltips.neverReceived')
									"
									@status:refused="refuse(item._id)" />
								<btn-refuse-status
									v-if="
										item.status ===
										RequestStatus.RETURN_PENDING
									"
									:tooltip="
										$t('request.tooltips.refuseReturn')
									"
									@status:refused="refuseReturn(item._id)" />

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
