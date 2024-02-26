<script setup lang="ts">
	import { ref, watch } from 'vue'
	import { useDisplay } from 'vuetify'
	import { useRoute } from 'vue-router'
	import { useI18n } from 'vue-i18n'
	import { useMainStore } from '../../../store'
	import {
		mdiAccountCircle,
		mdiBookshelf,
		mdiLogin,
		mdiLogout,
		mdiMagnify,
	} from '@mdi/js'
	import { computed } from 'vue'

	const mainStore = useMainStore()
	const route = useRoute()
	const { t } = useI18n({})
	const { lgAndUp, mdAndDown } = useDisplay()
	const drawerOpened = ref(false)
	const menuItems = ref([])

	const profile = computed(() => mainStore.profile)

	const changeDrawerStatus = () => {
		drawerOpened.value = !drawerOpened.value
	}

	watch(profile, () => {
		menuItems.value = []

		if (profile.value) {
			menuItems.value.push(
				{
					prependIcon: mdiMagnify,
					title: t('common.menu.search'),
					link: { name: 'home' },
				},
				{
					prependIcon: mdiAccountCircle,
					title: t('common.menu.profile'),
					link: { name: 'account' },
					children: [
						{
							prependIcon: mdiBookshelf,
							title: t('common.menu.yourbooks'),
							link: { name: 'yourBooks' },
						},
					],
				},
				{
					prependIcon: mdiMagnify,
					title: t('common.menu.requests'),
					link: { name: 'requests' },
				},
			)
		} else {
			menuItems.value.push({
				prependIcon: mdiLogin,
				title: t('common.menu.signin'),
				link: { name: 'signin' },
			})
		}
	})

	defineExpose({
		changeDrawerStatus,
	})

	const events = defineEmits(['logout'])
</script>

<template>
	<v-navigation-drawer
		v-if="profile"
		color="primary"
		class="mobile-menu"
		:elevation="2"
		:model-value="mdAndDown ? drawerOpened : true"
		:permanent="lgAndUp"
		sticky>
		<v-list density="compact">
			<v-list-group
				v-for="(item, index) in menuItems"
				:key="`drawer-${index}`"
				:value="item.title">
				<template v-slot:activator="{ props }">
					<v-list-item
						:active="item.link.name === route.name.toString()"
						v-bind="props"
						:to="!item.children?.length ? item.link : null"
						@click.stop="item.action ?? null">
						<template v-slot:prepend>
							<v-icon
								size="24"
								:icon="item.prependIcon" />
						</template>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						<template
							v-slot:append
							v-if="!item.children?.length"></template>
					</v-list-item>
				</template>
				<template v-if="item.children?.length">
					<v-list-item
						:active="child.link.name === route.name.toString()"
						v-for="(child, index2) in item.children"
						:key="`drawer-${index}-${index2}`"
						:to="child.link ?? null"
						@click.stop="child.action ?? null">
						<template v-slot:prepend>
							<v-icon
								size="24"
								:icon="child.prependIcon" />
						</template>
						<v-list-item-title>{{ child.title }}</v-list-item-title>
					</v-list-item>
				</template>
			</v-list-group>

			<v-list-item
				v-if="profile"
				@click.stop="events('logout')">
				<template v-slot:prepend>
					<v-icon
						size="24"
						:icon="mdiLogout" />
				</template>
				<v-list-item-title>{{
					$t('common.menu.logout')
				}}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<style lang="scss">
	.v-list-item--density-compact:not(.v-list-item--nav).v-list-item--one-line {
		padding-inline-start: 13px !important;
	}
	.v-list-item__prepend > .v-icon {
		opacity: 1 !important;
	}

	.v-list-group__items {
		.v-list-item--density-compact:not(
				.v-list-item--nav
			).v-list-item--one-line {
			padding-inline-start: 20px !important;
		}
	}

	.v-list-item--active .v-list-item__overlay {
		opacity: 0.3 !important;
	}
</style>

<style lang="scss" scoped>
	.v-icon {
		cursor: pointer;
	}

	.mobile-menu {
		display: flex;
		flex-direction: column;
		height: 100%;

		> div > .v-list {
			position: sticky;
			height: 100%;
		}
	}
</style>
