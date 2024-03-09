import {
	type IBook,
	type IBooksList,
	type IExternalProfile,
} from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profileStore', () => {
	const booksList = ref<IBook[]>([])
	const booksListPage = ref<number>(1)
	const booksListLoading = ref<boolean>(false)
	const booksListTotal = ref<number>(0)
	const profile = ref<IExternalProfile>(null)

	const loadBooks = (userId: string): void => {
		booksListLoading.value = true
		axios
			.get(
				EnvConfig.api.base +
					EnvConfig.api.url.library +
					'user/' +
					userId,
				{
					params: {
						page: booksListPage.value - 1,
					},
					headers: {
						'x-token': localStorage.getItem('user'),
					},
				},
			)
			.then((response: { data: IBooksList }) => {
				booksList.value = response.data.results
				booksListTotal.value = response.data.total
			})
			.finally(() => {
				booksListLoading.value = false
			})
	}

	const loadProfile = (userId: string): void => {
		axios
			.get(EnvConfig.api.base + EnvConfig.api.url.user + userId, {
				headers: {
					'Content-Type': 'application/json',
					'x-token': localStorage.getItem('user'),
				},
			})
			.then((res) => {
				profile.value = res.data
			})
	}

	return {
		loadBooks,
		booksList,
		booksListPage,
		booksListLoading,
		booksListTotal,
		loadProfile,
		profile,
	}
})
