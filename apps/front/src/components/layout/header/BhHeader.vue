<script setup lang="ts">
	import { mdiAccountCircle, mdiBook } from '@mdi/js'
	import { ref } from 'vue'
	import BhLogoutDialog from './BhLogoutDialog.vue'
	import BhNavigationDrawer from './BhNavigationDrawer.vue'
	import { useMainStore } from '../../../store'
	import { computed } from 'vue'

	const mainStore = useMainStore()
	const logoutDialog = ref(null)
	const drawer = ref(null)

	const profile = computed(() => mainStore.profile)
</script>

<template>
	<v-app-bar
		color="primary"
		flat
		height="50">
		<template v-slot:prepend>
			<v-app-bar-nav-icon
				v-if="profile"
				:icon="mdiAccountCircle"
				:size="30"
				@click.stop="drawer.changeDrawerStatus()" />
		</template>

		<template v-slot:title>
			<router-link :to="{ name: 'home' }">
				<div class="d-flex align-center justify-center">
					<v-icon size="20">
						{{ mdiBook }}
					</v-icon>
					<span>{{ $t('common.websiteName') }}</span>
				</div>
			</router-link>
		</template>

		<template v-slot:append></template>
	</v-app-bar>

	<BhLogoutDialog ref="logoutDialog" />

	<BhNavigationDrawer
		ref="drawer"
		@logout="logoutDialog.open()" />
</template>

<style lang="scss">
	.v-app-bar .v-toolbar {
		&__prepend,
		&__append {
			width: 150px;
		}

		&__append {
			justify-content: end;
		}

		&-title {
			margin-inline-start: 0;
		}
	}

	@media (max-width: 960px) {
		.v-app-bar .v-toolbar__prepend,
		.v-app-bar .v-toolbar__append {
			width: auto;
		}
	}
</style>
