<script setup lang="ts">
	import { mdiAccountCircle, mdiBook, mdiLogin } from '@mdi/js'
	import { ref } from 'vue'
	import { useDisplay } from 'vuetify'
	import { useI18n } from 'vue-i18n'
	import { BhSearchBar, type ISearchingEventProps } from '@bookhood/ui'
	import { type IBook } from '../../interfaces/book.interface'
	import { useRoute } from 'vue-router'
	import { watch } from 'vue'
	import { isAuthenticated } from '../../plugins/authentication'
	import { useBookStore } from '../../store/book.store'

	const bookStore = useBookStore()
	const route = useRoute()
	const { t } = useI18n({})
	const { lgAndUp, smAndDown } = useDisplay()
	const drawerOpened = ref(false)
	const searchBar = ref(null)
	const menuItems = ref([])

	watch(route, () => {
		menuItems.value = []

		if (isAuthenticated()) {
			menuItems.value.push({
				prependIcon: mdiAccountCircle,
				title: t('common.menu.profile'),
				link: { name: 'account' },
			})
		} else {
			menuItems.value.push({
				prependIcon: mdiLogin,
				title: t('common.menu.signin'),
				link: { name: 'signin' },
			})
		}
	})

	async function search(search: ISearchingEventProps) {
		const startAt = search.page * 10
		if (search.page === 0) {
			bookStore.searchMaxResults = 0
		}
		if (
			(bookStore.searchMaxResults > 0 &&
				startAt < bookStore.searchMaxResults) ||
			bookStore.searchMaxResults === 0
		) {
			const books: IBook[] = await bookStore.searchGoogleByName(
				search,
				startAt
			)
			searchBar.value.setItems(books)
		}
	}
</script>

<template>
	<v-app-bar
		color="primary"
		elevation="2"
		height="50">
		<template v-slot:prepend>
			<div
				class="d-flex align-center"
				v-if="smAndDown">
				<v-app-bar-nav-icon
					@click.stop="drawerOpened = !drawerOpened" />
				<router-link :to="{ name: 'home' }">
					<div class="d-flex align-center justify-space-between">
						<v-icon size="20">
							{{ mdiBook }}
						</v-icon>
						<span>{{ $t('common.websiteName') }}</span>
					</div>
				</router-link>
			</div>
			<router-link
				v-else
				:to="{ name: 'home' }">
				<div>
					<v-app-bar-nav-icon
						v-if="smAndDown"
						@click.stop="drawerOpened = !drawerOpened" />
					<div class="d-flex align-center justify-space-between">
						<v-icon size="20">
							{{ mdiBook }}
						</v-icon>
						<span>{{ $t('common.websiteName') }}</span>
					</div>
				</div>
			</router-link>
		</template>

		<template
			v-if="false"
			v-slot:title>
			<bh-search-bar
				ref="searchBar"
				:placeholder="$t('common.header.searchbar.label')"
				:authorLabel="$t('common.header.searchbar.authorLabel')"
				:bookLabel="$t('common.header.searchbar.bookLabel')"
				:noResultLabel="$t('common.header.searchbar.noResultLabel')"
				@searching="search" />
		</template>

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
		v-if="smAndDown"
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
		.v-app-bar .v-toolbar__prepend {
			width: auto;
		}
	}
</style>

<style lang="scss" scoped>
	.v-input {
		margin: auto;
	}
	.v-icon {
		cursor: pointer;
	}
</style>
