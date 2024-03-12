<script setup lang="ts">
	import { useRouter } from 'vue-router'
	import { useMainStore } from '../store'
	import { EnvConfig } from '../../config/env'

	const mainStore = useMainStore()
	const router = useRouter()

	localStorage.removeItem(EnvConfig.localStorage.userKey)
	mainStore.$patch({ profile: null })
	router.push({ name: 'home' })
</script>

<template><div></div></template>
