/* eslint-disable @nx/enforce-module-boundaries */
import { describe, vi } from 'vitest'
import { useBookStore } from '../../src/store/book.store'
import { createPinia, setActivePinia } from 'pinia'
import axios from 'axios'
import { bookToAdd, googleBooksSearch, searchResults } from '../data/bookData'
import { mapBook, mapBooks } from '../../src/mappers/bookMapper'
import { LibraryStatus } from '../../../shared/src'
import { libraries } from '../data/libraryData'

vi.mock('axios')

describe('Testint the book store', () => {
	let store

	beforeEach(() => {
		setActivePinia(createPinia())
		store = useBookStore()
		vi.clearAllMocks()
	})

	describe('Testing the searchGoogleByName', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce({
				data: googleBooksSearch,
			})

			const res = await store.searchGoogleByName(
				{ text: '', page: 1, type: 'inauthor' },
				0,
			)

			expect(axios.post).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject(mapBooks(googleBooksSearch.items))
			expect(store.searchMaxResults).toBe(googleBooksSearch.totalItems)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'post').mockRejectedValueOnce({})

			const res = await store.searchGoogleByName(
				{ text: '', page: 1, type: 'inauthor' },
				0,
			)

			expect(axios.post).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject([])
			expect(store.searchMaxResults).toBe(0)
		})
	})

	describe('Testing the searchByName', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce(searchResults)

			const res = await store.searchByName(
				{ text: '', page: 1, type: 'inauthor' },
				0,
				[0, 0, 0, 0],
			)

			expect(axios.post).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject(searchResults)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'post').mockRejectedValueOnce({})

			const res = await store.searchByName(
				{ text: '', page: 1, type: 'inauthor' },
				0,
				[0, 0, 0, 0],
			)

			expect(axios.post).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject([])
		})
	})

	describe('Testing the searchGoogleByISBN', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: googleBooksSearch,
			})

			const res = await store.searchGoogleByISBN('')

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject(mapBook(googleBooksSearch.items[0]))
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			const res = await store.searchGoogleByISBN('')

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(res).toBeNull()
		})
	})

	describe('Testing the add', () => {
		it('should succeed creating the book', async () => {
			vi.spyOn(axios, 'post').mockResolvedValueOnce({})

			await store.add(
				bookToAdd,
				LibraryStatus.TO_LEND,
				{ lat: 0, lng: 0 },
				'place',
			)

			expect(axios.post).toHaveBeenCalledTimes(1)
		})
	})

	describe('Testing the loadBooks', () => {
		it('should succeed getting the data', async () => {
			vi.spyOn(axios, 'get').mockResolvedValueOnce({
				data: libraries,
			})

			const res = await store.loadBooks()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject(libraries)
		})

		it('should fail getting the data', async () => {
			vi.spyOn(axios, 'get').mockRejectedValueOnce({})

			const res = await store.loadBooks()

			expect(axios.get).toHaveBeenCalledTimes(1)
			expect(res).toMatchObject([])
		})
	})
})
