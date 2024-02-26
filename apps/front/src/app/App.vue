<script setup lang="ts">
	import BhHeader from '../components/layout/header/BhHeader.vue'
	import BhLogoutDialog from '../components/layout/header/BhLogoutDialog.vue'
	import BhNavigationDrawer from '../components/layout/header/BhNavigationDrawer.vue'
	import { BhSnackbarError, BhSnackbarSuccess } from '@bookhood/ui'
	import { useMainStore } from '../store'
	import { onMounted } from 'vue'
	import { computed } from 'vue'
	import { useRoute } from 'vue-router'
	import { ref } from 'vue'

	const mainStore = useMainStore()
	const route = useRoute()

	const drawer = ref(null)
	const logoutDialog = ref(null)
	const profile = computed(() => mainStore.profile)

	onMounted(() => {
		mainStore.getProfile()
	})
</script>

<template>
	<v-app>
		<BhHeader @change-drawer-status="drawer.changeDrawerStatus()" />

		<BhNavigationDrawer
			ref="drawer"
			@logout="logoutDialog.open()" />

		<BhLogoutDialog ref="logoutDialog" />

		<v-container
			fluid
			:class="route.meta.fullHeight ? 'fullheight' : ''">
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
		position: absolute;
		top: 50px;
		bottom: 0px;
		overflow-y: auto;
		height: calc(100% - 50px);
		max-height: calc(100% - 50px);

		&.fullheight .v-row {
			height: 100%;
		}
	}
</style>
