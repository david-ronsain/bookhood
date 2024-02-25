import { type IBook, type IBooksList } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfileStore = defineStore('profileStore', () => {
	const booksList = ref<IBook[]>([])
	const booksListPage = ref<number>(1)
	const booksListLoading = ref<boolean>(false)
	const booksListTotal = ref<number>(0)

	const loadBooks = (userId: string): void => {
		booksListLoading.value = true
		axios
			.get(
				EnvConfig.api.base + EnvConfig.api.url.user + userId + '/books',
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

	const loadProfile = (userId: string) => {
		return axios.get(EnvConfig.api.base + EnvConfig.api.url.user + userId, {
			headers: {
				'Content-Type': 'application/json',
				'x-token': localStorage.getItem('user'),
			},
		})
	}

	return {
		loadBooks,
		booksList,
		booksListPage,
		booksListLoading,
		booksListTotal,
		loadProfile,
	}
})
