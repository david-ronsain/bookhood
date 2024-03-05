import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IBooksList, IBook, RequestStatus } from '@bookhood/shared'

export const useAccountStore = defineStore('accountStore', () => {
	const booksPage = ref<number>(1)
	const booksNb = ref<number>(0)
	const booksLoading = ref<boolean>(false)
	const books = ref<IBook[]>([])

	const loadBooks = (userId: string): void => {
		booksLoading.value = true
		axios
			.get(
				EnvConfig.api.base +
					EnvConfig.api.url.library +
					'user/' +
					userId,
				{
					params: {
						page: booksPage.value - 1,
					},
					headers: {
						'x-token': localStorage.getItem('user'),
					},
				},
			)
			.then((response: { data: IBooksList }) => {
				books.value = response.data.results
				booksNb.value = response.data.total
			})
			.finally(() => {
				booksLoading.value = false
			})
	}

	const updateBookStatus = (
		libraryId: string,
		status: RequestStatus,
	): Promise<any> =>
		axios.patch(
			EnvConfig.api.base + EnvConfig.api.url.library + libraryId,
			{
				status,
			},
			{
				headers: {
					'x-token': localStorage.getItem('user'),
				},
			},
		)

	return {
		booksPage,
		books,
		booksLoading,
		loadBooks,
		updateBookStatus,
	}
})
