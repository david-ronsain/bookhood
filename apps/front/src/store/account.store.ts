/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvConfig } from '../../config/env'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
	IBooksList,
	LibraryStatus,
	IBooksListResult,
} from '@bookhood/shared'
import { useFetch } from '../composables/fetch.composable'

const { GET, PATCH } = useFetch()

export const useAccountStore = defineStore('accountStore', () => {
	const booksPage = ref<number>(1)
	const booksLoading = ref<boolean>(false)
	const books = ref<IBooksListResult[]>([])

	const loadBooks = (userId: string): Promise<any> => {
		booksLoading.value = true
		return GET(EnvConfig.api.url.library + 'user/' + userId, {
			page: booksPage.value - 1,
		})
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
		PATCH(EnvConfig.api.url.library + libraryId, {
			status,
		}).then(() => {
			const index = books.value.findIndex(
				(lib: IBooksListResult) => lib._id === libraryId,
			)

			if (index >= 0) {
				books.value[index].status = status
			}
		})

	return {
		booksPage,
		books,
		booksLoading,
		loadBooks,
		updateBookStatus,
	}
})
