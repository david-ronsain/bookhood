import axios from 'axios'
import { createPinia, setActivePinia } from 'pinia'
import { describe, vi } from 'vitest'
import { useUserStore } from '../../src/store/user.store'
import { createdUser, user } from '../data/userData'

vi.mock('axios')

describe('Testint the main store', () => {
	let store

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useUserStore()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('Testing the signup', () => {
		it('should succeed creating the user', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce({
				data: createdUser,
			})

			await store.signup({})

			expect(axios.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('Testing the sendSigninLink', () => {
		it('should succeed sending the signin link', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce({
				data: createdUser,
			})

			await store.sendSigninLink('')

			expect(axios.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('Testing the signin', () => {
		it('should succeed signing in', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce({
				data: createdUser,
			})

			await store.signin('')

			expect(axios.post).toHaveBeenCalledTimes(1)
		})
	})
})
