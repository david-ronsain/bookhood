<script setup lang="ts">
	import { mdiAccountCircle, mdiBook, mdiLogin } from '@mdi/js'
	import { ref } from 'vue'
	import { useDisplay } from 'vuetify'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const { mdAndDown, lgAndUp } = useDisplay()
	const drawerOpened = ref(false)
	const menuItems = ref([
		{
			prependIcon: mdiLogin,
			title: t('common.menu.signin'),
			link: { name: 'signin' },
		},
		{
			prependIcon: mdiAccountCircle,
			title: t('common.menu.profile'),
			link: { name: 'account' },
		},
	])
</script>

<template>
	<v-app-bar
		color="primary"
		elevation="2"
		height="50">
		<template
			v-if="mdAndDown"
			v-slot:prepend>
			<v-app-bar-nav-icon @click.stop="drawerOpened = !drawerOpened" />
		</template>

		<v-app-bar-title>
			<v-icon size="20">
				{{ mdiBook }}
			</v-icon>
			BookHood
		</v-app-bar-title>

		<template
			v-if="lgAndUp"
			v-slot:append>
			<v-menu open-on-hover>
				<template v-slot:activator="{ props }">
					<v-icon
						color="white"
						v-bind="props"
						:icon="mdiAccountCircle"
						size="30" />
				</template>
				<v-list density="compact">
					<v-list-item
						v-for="(item, index) in menuItems"
						:key="`drawer-${index}`"
						:to="item.link ?? null"
						:data-data="item.action"
						@click.stop="item.action ?? null">
						<template v-slot:prepend>
							<v-icon
								size="16"
								:icon="item.prependIcon" />
						</template>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</template>
	</v-app-bar>

	<v-navigation-drawer
		:elevation="2"
		:model-value="drawerOpened"
		sticky>
		<v-list density="compact">
			<v-list-item
				v-for="(item, index) in menuItems"
				:key="`drawer-${index}`"
				:to="item.link ?? null"
				@click.stop="item.action ?? null">
				<template v-slot:prepend>
					<v-icon
						size="24"
						:icon="item.prependIcon" />
				</template>
				<v-list-item-title>{{ item.title }}</v-list-item-title>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<style lang="scss" scoped>
	.v-icon {
		cursor: pointer;
	}
</style>
