<script setup lang="ts">
	import { mdiAccountCircle, mdiBook, mdiLogin } from '@mdi/js'
	import { ref } from 'vue'
	import { useDisplay } from 'vuetify'
	import { useI18n } from 'vue-i18n'
	import { BhSearchBar, type ISearchingEventProps } from '@bookhood/ui'
	import axios from 'axios'
	import { mapBooks } from '../../mappers/bookMapper'
	import { type IBookAutocompleteItem } from '../../interfaces/book.interface'
	import { EnvConfig } from '../../../config/env'

	const { t } = useI18n({})
	const { mdAndDown, lgAndUp } = useDisplay()
	const drawerOpened = ref(false)
	const searchBar = ref(null)
	const maxResults = ref<number>(0)
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

	async function search(search: ISearchingEventProps) {
		const startAt = search.page * 10
		if (search.page === 0) {
			maxResults.value = 0
		}
		if (
			(maxResults.value > 0 && startAt < maxResults.value) ||
			maxResults.value === 0
		) {
			const books: IBookAutocompleteItem[] = await axios
				.get(EnvConfig.googleApi.url, {
					params: {
						//fields: '',
						q: `${search.type}:${search.text.replace(/ /, '+')}`,
						startIndex: startAt,
						key: EnvConfig.googleApi.key,
						printType: 'books',
						langRestrict: 'fr',
					},
				})
				.then((results) => {
					maxResults.value = parseInt(results.data.totalItems)
					return mapBooks(
						results.data.items.filter((book) =>
							(book.volumeInfo?.industryIdentifiers || []).find(
								(id) => ['ISBN_10', 'ISBN_13'].includes(id.type)
							)
						)
					)
				})
				.catch(() => {
					return []
				})

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
			<div>
				<v-app-bar-nav-icon
					v-if="mdAndDown"
					@click.stop="drawerOpened = !drawerOpened" />
				<div class="d-flex align-center justify-space-between">
					<v-icon size="20">
						{{ mdiBook }}
					</v-icon>
					<span>{{ $t('common.websiteName') }}</span>
				</div>
			</div>
		</template>

		<template v-slot:title>
			<bh-search-bar
				ref="searchBar"
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
</style>

<style lang="scss" scoped>
	.v-input {
		margin: auto;
	}
	.v-icon {
		cursor: pointer;
	}
</style>
