import {
	RequestStatus,
	type IRequestList,
	type IGetRequests,
} from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestStore = defineStore('requestStore', () => {
	const incomingRequestPage = ref<number>(1)
	const incomingRequests = ref<IRequestList>({ total: 0, results: [] })
	const outgoingRequestPage = ref<number>(1)
	const outgoingRequests = ref<IRequestList>({ total: 0, results: [] })

	const create = (libraryId: string) =>
		axios.post(
			EnvConfig.api.base + EnvConfig.api.url.request + libraryId,
			{},
			{
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			},
		)

	const refuse = (requestId: string) =>
		updateStatus(requestId, RequestStatus.REFUSED)

	const refuseReturn = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RETURNED_WITH_ISSUE)

	const received = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RECEIVED)

	const neverReceived = (requestId: string) =>
		updateStatus(requestId, RequestStatus.NEVER_RECEIVED)

	const accept = (requestId: string) =>
		updateStatus(requestId, RequestStatus.ACCEPTED_PENDING_DELIVERY)

	const acceptReturn = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RETURN_ACCEPTED)

	const returned = (requestId: string) =>
		updateStatus(requestId, RequestStatus.RETURN_PENDING)

	const issueFixed = (requestId: string) =>
		updateStatus(requestId, RequestStatus.ISSUE_FIXED)

	const updateStatus = (requestId: string, status: RequestStatus) =>
		axios.patch(
			EnvConfig.api.base + EnvConfig.api.url.request + requestId,
			{ status },
			{
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			},
		)

	const getIncomingRequests = (body: IGetRequests): IRequestList =>
		axios
			.get(EnvConfig.api.base + EnvConfig.api.url.request, {
				params: {
					startAt: (incomingRequestPage.value - 1) * 10,
					status: body.status,
					ownerId: body.ownerId,
					userId: body.userId,
				},
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			})
			.then((results) => {
				incomingRequests.value = results.data
				return results.data
			})

	const getOutgoingRequests = (body: IGetRequests): IRequestList =>
		axios
			.get(EnvConfig.api.base + EnvConfig.api.url.request, {
				params: {
					startAt: (outgoingRequestPage.value - 1) * 10,
					status: body.status,
					ownerId: body.ownerId,
					userId: body.userId,
				},
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			})
			.then((results) => {
				outgoingRequests.value = results.data
				return results.data
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
	}
})
