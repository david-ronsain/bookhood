import { defineStore } from 'pinia'
import axios from 'axios'
import { EnvConfig } from '../../config/env'
import { type CreateUserDTO } from '@bookhood/shared'

export const useUserStore = defineStore('userStore', () => {
	async function signup(user: CreateUserDTO) {
		return axios.post(EnvConfig.api.url.user, user, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}

	return {
		signup,
	}
})
