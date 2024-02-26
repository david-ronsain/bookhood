<script setup lang="ts">
	import { mdiAccountCircle, mdiBook } from '@mdi/js'
	import { useMainStore } from '../../../store'
	import { computed } from 'vue'

	const mainStore = useMainStore()

	const profile = computed(() => mainStore.profile)

	const events = defineEmits(['changeDrawerStatus'])
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
				@click.stop="events('changeDrawerStatus')" />
			<span
				v-if="profile"
				v-text="$t('common.hello', { firstName: profile.firstName })" />
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
