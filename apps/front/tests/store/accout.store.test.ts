import { describe, vi } from 'vitest'
import { useAccountStore } from '../../src/store/account.store'
import { createPinia, setActivePinia } from 'pinia'
import axios from 'axios'
import { booksResults } from '../data/bookData'
import { LibraryStatus } from '../../../shared/src'

vi.mock('axios')

describe('Testint the account store', () => {
	let store

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useAccountStore()
	})

	describe('Testing the loadBooks', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockImplementation(() =>
				Promise.resolve({
					data: booksResults,
				}),
			)
			await store.loadBooks('')

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.books).toMatchObject(booksResults.results)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockImplementation(() => Promise.reject())
			await store.loadBooks('')

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(store.books).toMatchObject([])
		})
	})

	describe('Testing the updateBookStatus', () => {
		it('should update the status', async () => {
			store.books = JSON.parse(JSON.stringify(booksResults.results))
			vi.spyOn(axios, 'patch').mockImplementation(() => Promise.resolve())

			await store.updateBookStatus(
				booksResults.results[0]._id,
				LibraryStatus.TO_GIVE,
			)

			expect(store.books[0].status).toBe(LibraryStatus.TO_GIVE)
		})

		it('should fail updating the status', async () => {
			store.books = JSON.parse(JSON.stringify(booksResults.results))
			vi.spyOn(axios, 'patch').mockImplementation(() => Promise.reject())

			await store.updateBookStatus(
				booksResults.results[0]._id,
				LibraryStatus.TO_GIVE,
			)

			expect(store.books[0].status).toBe(LibraryStatus.TO_LEND)
		})
	})
})
