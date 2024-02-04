import { EnvConfig } from '../../config/env'
import { type ISearchingEventProps } from '@bookhood/ui'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mapBook, mapBooks } from '../mappers/bookMapper'
import type { IBook } from '@bookhood/shared'

export const useBookStore = defineStore('bookStore', () => {
	const searchMaxResults = ref<number>(0)

	const searchGoogleByName = async (
		search: ISearchingEventProps,
		startAt: number,
	): Promise<IBook[]> =>
		axios
			.post(
				EnvConfig.api.base + EnvConfig.api.url.book + 'google/search',
				{
					q: `${search.type}:${search.text.replace(/ /, '+')}`,
					startIndex: startAt,
				},
			)
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
				return []
			})

	const searchByName = async (
		search: ISearchingEventProps,
		startAt: number,
		boundingBox: number[],
	): Promise<IBookSearch> =>
		axios
			.post(EnvConfig.api.base + EnvConfig.api.url.book + 'search', {
				q: `${search.type}:${search.text.replace(/ /, '+')}`,
				startIndex: startAt,
				boundingBox,
			})
			.catch(() => {
				return []
			})

	const searchGoogleByISBN = async (isbn: string): Promise<IBook | null> =>
		axios
			.get(EnvConfig.api.base + EnvConfig.api.url.book + 'google/' + isbn)
			.then((results) =>
				results.data.totalItems > 0
					? mapBook(results.data.items[0])
					: null,
			)
			.catch(() => {
				return null
			})

	const add = async (book: IBook, location: { lat; lng }) =>
		axios.post(
			EnvConfig.api.base + EnvConfig.api.url.book,
			{ ...book, location },
			{
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			},
		)

	return {
		searchGoogleByName,
		searchMaxResults,
		searchGoogleByISBN,
		add,
		searchByName,
	}
})
