import { type IUser } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('mainStore', () => {
	const error = ref<string>('')
	const success = ref<string>('')
	const profile = ref<IUser>(null)

	const getProfile = async (): Promise<void> => {
		if (localStorage.getItem('user')) {
			await axios
				.get(EnvConfig.api.base + EnvConfig.api.url.user + 'me', {
					headers: {
						'x-token': localStorage.getItem('user'),
					},
				})
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
