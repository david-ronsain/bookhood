<script setup lang="ts">
	import BhHeader from '../components/layout/BhHeader.vue'
	import { BhSnackbarError, BhSnackbarSuccess } from '@bookhood/ui'
	import { useMainStore } from '../store'

	const mainStore = useMainStore()
</script>

<template>
	<v-app>
		<BhHeader />

		<v-container fluid>
			<v-row>
				<v-col
					class="d-none d-md-block"
					cols="2"></v-col>
				<v-col
					cols="12"
					md="8">
					<router-view id="main-content" />
				</v-col>
				<v-col
					class="d-none d-md-block"
					cols="2"></v-col>
			</v-row>
		</v-container>

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
		max-width: 1200px;
		margin: 0 auto;
	}

	@media #{map-get($display-breakpoints, 'md-and-up')} {
		#main-content {
			width: calc(100% - 48px);
		}
	}

	.v-application > div > .v-container {
		position: relative;
		top: 74px;
	}
</style>
