import { type IUser } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFetch } from '../composables/fetch.composable'

const { GET } = useFetch()

export const useMainStore = defineStore('mainStore', () => {
	const error = ref<string>('')
	const success = ref<string>('')
	const profile = ref<IUser>(null)

	const getProfile = async (): Promise<void> => {
		if (localStorage.getItem(EnvConfig.localStorage.userKey)) {
			GET(EnvConfig.api.url.user + 'me')
				.then((response) => {
					profile.value = response.data
				})
				.catch(() => {
					profile.value = null
				})
		}
	}

	return {
		error,
		success,
		profile,
		getProfile,
	}
})
