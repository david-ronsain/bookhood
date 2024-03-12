import axios from 'axios'
import { createPinia, setActivePinia } from 'pinia'
import { describe, vi } from 'vitest'
import { useMainStore } from '../../src/store/main.store'
import { user } from '../data/userData'
import { EnvConfig } from '../../config/env'

vi.mock('axios')

describe('Testint the main store', () => {
	let store

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useMainStore()
	})

	afterEach(() => {
		localStorage.removeItem(EnvConfig.localStorage.userKey)
		vi.clearAllMocks()
	})

	describe('Testing the getProfile', () => {
		it('should succeed getting the data', async () => {
			localStorage.setItem(EnvConfig.localStorage.userKey, '||')
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: user,
			})

			await store.getProfile()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.profile).toMatchObject(user)
		})

		it('should fail getting the data because the token is not set', async () => {
			await store.getProfile()

			expect(axios.get).not.toHaveBeenCalled()
			expect(store.profile).toBeNull()
		})

		it('should fail getting the data', async () => {
			localStorage.setItem(EnvConfig.localStorage.userKey, '||')
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			await store.getProfile()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.profile).toBeNull()
		})
	})
})
