<script setup lang="ts">
	import BhHeader from '../components/layout/header/BhHeader.vue'
	import { BhSnackbarError, BhSnackbarSuccess } from '@bookhood/ui'
	import { useMainStore } from '../store'
	import { onMounted } from 'vue'
	import { computed } from 'vue'

	const mainStore = useMainStore()

	const profile = computed(() => mainStore.profile)

	onMounted(() => {
		mainStore.getProfile()
	})
</script>

<template>
	<v-app>
		<BhHeader />

		<v-container fluid>
			<v-row>
				<v-col
					:class="profile ? 'd-md-block ' : ''"
					class="d-none"
					cols="2"></v-col>
				<v-col
					cols="12"
					:md="profile ? 10 : 12">
					<router-view
						class="pa-0"
						id="main-content" />
				</v-col>
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
		margin: 0 auto;
	}

	.v-application > div > .v-container {
		position: relative;
		top: 50px;
	}
</style>
