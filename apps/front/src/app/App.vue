<script setup lang="ts">
	import { ref } from 'vue'
	import BhHeader from '../components/layout/BhHeader.vue'
	import { BhSnackbarError, BhSnackbarSuccess } from '@bookhood/ui'
	import { useMainStore } from '../store'

	const mainStore = useMainStore()
</script>

<template>
	<v-app>
		<BhHeader />
		<router-view id="main-content" />

		<bh-snackbar-error
			:opened="mainStore.error.length > 0"
			:text="mainStore.error"
			@close="mainStore.$patch({ error: '' })" />

		<bh-snackbar-success
			:opened="mainStore.success.length > 0"
			:text="mainStore.success"
			@close="mainStore.$patch({ success: '' })" />
	</v-app>
</template>

<style lang="scss" scoped>
	@import 'vuetify/lib/styles/settings/_variables';
	#main-content {
		position: relative;
		top: 74px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	@media #{map-get($display-breakpoints, 'md-and-up')} {
		#main-content {
			width: calc(100% - 48px);
		}
	}
</style>
