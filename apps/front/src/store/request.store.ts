import {
	RequestStatus,
	type IRequestList,
	type IGetRequests,
} from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '../composables/fetch.composable'

const { POST, PATCH, GET } = useFetch()

export const useRequestStore = defineStore('requestStore', () => {
	const incomingRequestPage = ref<number>(1)
	const incomingRequests = ref<IRequestList>({ total: 0, results: [] })
	const outgoingRequestPage = ref<number>(1)
	const outgoingRequests = ref<IRequestList>({ total: 0, results: [] })

	const create = (libraryId: string, dates: string[]) =>
		POST(EnvConfig.api.url.request + libraryId, { dates })

	const refuse = (requestId: string) =>
		updateStatus(requestId, RequestStatus.REFUSED)

	const refuseReturn = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RETURNED_WITH_ISSUE)

	const received = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RECEIVED)

	const neverReceived = (requestId: string) =>
		updateStatus(requestId, RequestStatus.NEVER_RECEIVED)

	const accept = (requestId: string, dates: string[]) =>
		updateStatus(requestId, RequestStatus.ACCEPTED_PENDING_DELIVERY, dates)

	const acceptReturn = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RETURN_ACCEPTED)

	const returned = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RETURN_PENDING)

	const issueFixed = (requestId: string) =>
		updateStatus(requestId, RequestStatus.ISSUE_FIXED)

	const changeDates = (requestId: string, dates: string[]) =>
		updateStatus(requestId, RequestStatus.PENDING_VALIDATION, dates)

	const updateStatus = (
		requestId: string,
		status: RequestStatus,
		dates?: string[],
	) => PATCH(EnvConfig.api.url.request + requestId, { status, dates })

	const getIncomingRequests = (body: IGetRequests): IRequestList =>
		GET(EnvConfig.api.url.request, {
			startAt: (incomingRequestPage.value - 1) * 10,
			status: body.status,
			ownerId: body.ownerId,
			userId: body.userId,
		})
			.then((results) => {
				incomingRequests.value = results.data
				return results.data
			})
			.catch(() => {
				incomingRequests.value = []
			})

	const getOutgoingRequests = (body: IGetRequests): IRequestList =>
		GET(EnvConfig.api.url.request, {
			startAt: (outgoingRequestPage.value - 1) * 10,
			status: body.status,
			ownerId: body.ownerId,
			userId: body.userId,
		})
			.then((results) => {
				outgoingRequests.value = results.data
				return results.data
			})
			.catch(() => {
				outgoingRequests.value = []
			})

	return {
		create,
		getIncomingRequests,
		getOutgoingRequests,
		accept,
		refuse,
		received,
		neverReceived,
		returned,
		acceptReturn,
		refuseReturn,
		issueFixed,
		incomingRequestPage,
		incomingRequests,
		outgoingRequestPage,
		outgoingRequests,
		changeDates,
	}
})
