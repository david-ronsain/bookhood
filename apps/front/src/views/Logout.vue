<script setup lang="ts">
	import { useRouter } from 'vue-router'
	import { useMainStore } from '../store'

	const mainStore = useMainStore()
	const router = useRouter()

	localStorage.removeItem('user')
	mainStore.$patch({ profile: null })
	router.push({ name: 'home' })
</script>

<template><div></div></template>
