/* eslint-disable @nx/enforce-module-boundaries */
import axios from 'axios'
import { createPinia, setActivePinia } from 'pinia'
import { describe, vi } from 'vitest'
import { useRequestStore } from '../../src/store/request.store'
import { request, requestsList } from '../data/requestData'
import { RequestStatus } from '../../../shared/src'

vi.mock('axios')

describe('Testing the request store', () => {
	let store

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useRequestStore()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('Testing the create', () => {
		it('should succeed creating the request', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.create('', [])

			expect(axios.post).toHaveBeenCalledTimes(1)
			expect(result).toMatchObject({
				data: request,
			})
		})
	})

	describe('Testing the refuse', () => {
		it('should succeed updating the request to refused', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.refuse('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the refuseReturn', () => {
		it('should succeed updating the request to refuseReturn', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.refuseReturn('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the received', () => {
		it('should succeed updating the request to received', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.received('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the neverReceived', () => {
		it('should succeed updating the request to neverReceived', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.neverReceived('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the accept', () => {
		it('should succeed updating the request to accept', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.accept('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the acceptReturn', () => {
		it('should succeed updating the request to acceptReturn', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.acceptReturn('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the returned', () => {
		it('should succeed updating the request to returned', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.returned('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the issueFixed', () => {
		it('should succeed updating the request to issueFixed', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.issueFixed('')

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the changeDates', () => {
		it('should succeed updating the request to changeDates', async () => {
			vi.spyOn(axios, 'patch').mockResolvedValueOnce({
				data: request,
			})

			const result = await store.changeDates('', [])

			expect(axios.patch).toHaveBeenCalledTimes(1)
			expect(result.data).toMatchObject(request)
		})
	})

	describe('Testing the getIncomingRequests', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: requestsList,
			})

			await store.getIncomingRequests({
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				ownerId: '',
				userId: '',
			})

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.incomingRequests).toMatchObject(requestsList)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			await store.getIncomingRequests({
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				ownerId: '',
				userId: '',
			})

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.incomingRequests).toMatchObject([])
		})
	})

	describe('Testing the getOutgoingRequests', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: requestsList,
			})

			await store.getOutgoingRequests({
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				ownerId: '',
				userId: '',
			})

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.outgoingRequests).toMatchObject(requestsList)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			await store.getOutgoingRequests({
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				ownerId: '',
				userId: '',
			})

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.outgoingRequests).toMatchObject([])
		})
	})
})
