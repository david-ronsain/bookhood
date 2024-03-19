import { EnvConfig } from '../../config/env'
import { type ISearchingEventProps } from '@bookhood/ui'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mapBook, mapBooks } from '../mappers/bookMapper'
import {
	type IBook,
	type IBookSearch,
	LibraryStatus,
	type ILibraryFull,
} from '@bookhood/shared'
import { useFetch } from '../composables/fetch.composable'

const { POST, GET } = useFetch()

export const useBookStore = defineStore('bookStore', () => {
	const searchMaxResults = ref<number>(0)

	const searchGoogleByName = async (
		search: ISearchingEventProps,
		startAt: number,
	): Promise<IBook[]> =>
		POST(EnvConfig.api.url.book + 'google/search', {
			q: `${search.type}:${search.text.replace(/ /, '+')}`,
			startIndex: startAt,
		})
			.then((results) => {
				searchMaxResults.value = parseInt(results.data.totalItems)
				return mapBooks(
					results.data.items.filter((book) =>
						(book.volumeInfo?.industryIdentifiers || []).find(
							(id) => ['ISBN_10', 'ISBN_13'].includes(id.type),
						),
					),
				)
			})
			.catch(() => {
				searchMaxResults.value = 0
				return []
			})

	const searchByName = async (
		search: ISearchingEventProps,
		startAt: number,
		boundingBox: number[],
	): Promise<IBookSearch> =>
		POST(EnvConfig.api.url.book + 'search', {
			q: `${search.type}:${search.text?.replace(/ /, '+') ?? ''}`,
			startIndex: startAt,
			boundingBox,
		}).catch(() => {
			return []
		})

	const searchGoogleByISBN = async (isbn: string): Promise<IBook | null> =>
		GET(EnvConfig.api.url.book + 'google/' + isbn)
			.then((results) =>
				results.data.totalItems > 0
					? mapBook(results.data.items[0])
					: null,
			)
			.catch(() => {
				return null
			})

	const add = async (
		book: IBook,
		status: LibraryStatus,
		location: { lat; lng },
		place: string,
	): Promise<IBook | null> =>
		POST(EnvConfig.api.url.book, { ...book, location, status, place })

	const loadBooks = (): Promise<ILibraryFull[]> =>
		GET(EnvConfig.api.url.book)
			.then((response: { data: ILibraryFull[] }) => response.data)
			.catch(() => [])

	return {
		searchGoogleByName,
		searchMaxResults,
		searchGoogleByISBN,
		add,
		searchByName,
		loadBooks,
	}
})
