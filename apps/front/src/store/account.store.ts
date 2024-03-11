import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
	IBooksList,
	IBook,
	LibraryStatus,
	IBooksListResult,
} from '@bookhood/shared'

export const useAccountStore = defineStore('accountStore', () => {
	const booksPage = ref<number>(1)
	const booksLoading = ref<boolean>(false)
	const books = ref<IBooksListResult[]>([])

	const loadBooks = (userId: string): Promise<any> => {
		booksLoading.value = true
		return axios
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
			})
			.catch(() => {
				books.value = []
			})
			.finally(() => {
				booksLoading.value = false
			})
	}

	const updateBookStatus = (
		libraryId: string,
		status: LibraryStatus,
	): Promise<any> =>
		axios
			.patch(
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
			.then(() => {
				const index = books.value.findIndex(
					(lib: IBooksListResult) => lib._id === libraryId,
				)

				if (index >= 0) {
					books.value[index].status = status
				}
			})
			.catch(() => {})

	return {
		booksPage,
		books,
		booksLoading,
		loadBooks,
		updateBookStatus,
	}
})
