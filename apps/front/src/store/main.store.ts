import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('mainStore', () => {
	const error = ref<string>('')
	const success = ref<string>('')

	return {
		error,
		success,
	}
})
