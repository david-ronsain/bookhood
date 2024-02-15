import { RequestStatus, type IRequestList } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRequestStore = defineStore('requestStore', () => {
	const pendingRequestPage = ref<number>(1)
	const pendingRequests = ref<IRequestList>({ total: 0, results: [] })

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
		axios.patch(
			EnvConfig.api.base + EnvConfig.api.url.request + requestId,
			{ status: RequestStatus.REFUSED },
			{
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			},
		)

	const accept = (requestId: string) =>
		axios.patch(
			EnvConfig.api.base + EnvConfig.api.url.request + requestId,
			{ status: RequestStatus.ACCEPTED_PENDING_DELIVERY },
			{
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			},
		)

	const getPending = (): IRequestList =>
		axios
			.get(
				EnvConfig.api.base +
					EnvConfig.api.url.request +
					`status/${RequestStatus.PENDING_VALIDATION}`,
				{
					params: {
						startAt: (pendingRequestPage.value - 1) * 10,
					},
					headers: {
						'x-token': localStorage.getItem('user'),
					},
				},
			)
			.then((results) => {
				pendingRequests.value = results.data
				return results.data
			})

	return {
		create,
		getPending,
		accept,
		refuse,
		pendingRequestPage,
		pendingRequests,
	}
})
