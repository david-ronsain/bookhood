import { defineStore } from 'pinia'
import { EnvConfig } from '../../config/env'
import { type CreateUserDTO } from '@bookhood/shared'
import { useFetch } from '../composables/fetch.composable'

const { POST } = useFetch()

export const useUserStore = defineStore('userStore', () => {
	async function signup(user: CreateUserDTO) {
		return POST(EnvConfig.api.url.user, user)
	}

	async function sendSigninLink(email: string) {
		return POST(EnvConfig.api.url.auth + 'link', { email })
	}

	async function signin(token: string) {
		return POST(EnvConfig.api.url.auth + 'signin', { token })
	}

	return {
		signup,
		sendSigninLink,
		signin,
	}
})
