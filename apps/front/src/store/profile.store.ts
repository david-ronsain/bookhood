import {
	type IBook,
	type IBooksList,
	type IExternalProfile,
	type IUserStats,
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
	const stats: IUserStats = ref(null)

	const loadBooks = async (userId: string): Promise<void> => {
		booksListLoading.value = true
		await axios
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
						'x-token': localStorage.getItem(
							EnvConfig.localStorage.userKey,
						),
					},
				},
			)
			.then((response: { data: IBooksList }) => {
				booksList.value = response.data.results
				booksListTotal.value = response.data.total
			})
			.catch(() => {
				booksList.value = []
				booksListTotal.value = 0
			})
			.finally(() => {
				booksListLoading.value = false
			})
	}

	const loadProfile = async (userId: string): Promise<void> => {
		await axios
			.get(EnvConfig.api.base + EnvConfig.api.url.user + userId, {
				headers: {
					'Content-Type': 'application/json',
					'x-token': localStorage.getItem(
						EnvConfig.localStorage.userKey,
					),
				},
			})
			.then((res) => {
				profile.value = res.data
			})
			.catch(() => {
				profile.value = null
			})
	}

	const loadProfileStats = async (): Promise<void> => {
		await axios
			.get(EnvConfig.api.base + EnvConfig.api.url.user + 'stats', {
				headers: {
					'Content-Type': 'application/json',
					'x-token': localStorage.getItem(
						EnvConfig.localStorage.userKey,
					),
				},
			})
			.then((res) => {
				stats.value = res.data
			})
			.catch(() => {
				stats.value = null
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
		loadProfileStats,
		stats,
	}
})
