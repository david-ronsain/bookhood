import axios from 'axios'
import { createPinia, setActivePinia } from 'pinia'
import { describe, vi } from 'vitest'
import { useProfileStore } from '../../src/store/profile.store'
import { booksResults } from '../data/bookData'
import { externalProfile, userStats } from '../data/profileData'

vi.mock('axios')

describe('Testint the profile store', () => {
	let store

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useProfileStore()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('Testing the loadBooks', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: booksResults,
			})

			await store.loadBooks()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.booksList).toMatchObject(booksResults.results)
			expect(store.booksListTotal).toMatchObject(booksResults.total)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			await store.loadBooks()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.booksList).toMatchObject([])
			expect(store.booksListTotal).toMatchObject(0)
		})
	})

	describe('Testing the loadProfile', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: externalProfile,
			})

			await store.loadProfile('')

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.profile).toMatchObject(externalProfile)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			await store.loadProfile('')

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.profile).toBeNull()
		})
	})

	describe('Testing the loadProfileStats', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: userStats,
			})

			await store.loadProfileStats()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.stats).toMatchObject(userStats)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce(null)

			await store.loadProfileStats()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.stats).toBeNull()
		})
	})
})
