<script setup lang="ts">
	import {
		mdiAccountTie,
		mdiBookOpenBlankVariantOutline,
		mdiCloseCircleOutline,
		mdiMagnify,
	} from '@mdi/js'
	import { watch } from 'vue'
	import { ref } from 'vue'
	import debounce from 'debounce'
	import type {
		BhSearchBarProps,
		IItem,
		ISearchingEventProps,
		ISearchTypeItem,
	} from '../../../interfaces/searchBar.interface'

	const props = withDefaults(defineProps<BhSearchBarProps>(), {
		isLoading: false,
		noResultLabel: 'No result',
		authorLabel: 'By author',
		bookLabel: 'By title',
	})

	const loading = ref(false)
	const items = ref<IItem[]>([])
	const searchValue = ref('')
	const page = ref<number>(0)
	const keepLoading = ref<boolean>(true)
	const openSearchTypeSelector = ref(false)
	const searchTypes = ref<ISearchTypeItem[]>([
		{
			value: 'inauthor',
			title: props.authorLabel,
			icon: mdiAccountTie,
		},
		{
			value: 'intitle',
			title: props.bookLabel,
			icon: mdiBookOpenBlankVariantOutline,
		},
	])
	const searchType = ref(searchTypes.value[1].value)

	watch(props, (p: BhSearchBarProps) => {
		loading.value = p.isLoading || false
	})

	function resetSearch() {
		searchValue.value = ''
		page.value = 0
		items.value = []
		loading.value = false
		keepLoading.value = true
	}

	const startSearch = (text: string) => {
		if (typeof text === 'string' && text.length > 0) {
			keepLoading.value = true
			searchValue.value = text.toString()
			loading.value = true
			debouncedSearch(text)
		} else if (typeof text === 'string') {
			resetSearch()
		}
	}

	const debouncedSearch = debounce((text: string) => {
		if (typeof text === 'string' && text.length) {
			events('searching', {
				type: searchType.value,
				text: searchValue.value.trim() || '',
				page: page.value,
			})
			page.value++
		}
	}, 750)

	function setItems(list: any[]) {
		items.value.push(...list)
		loading.value = false
	}

	function loadMore(isIntersecting: boolean) {
		if (isIntersecting && items.value.length) {
			startSearch(searchValue.value)
		}
	}

	function changeSearchType(type: 'inauthor' | 'intitle') {
		searchType.value = type
		openSearchTypeSelector.value = false
	}

	const events = defineEmits<{
		(e: 'searching', search: ISearchingEventProps): void
	}>()

	defineExpose({
		setItems,
	})
</script>

<template>
	<v-autocomplete
		bg-color="white"
		center-affix
		clearable
		:clear-icon="mdiCloseCircleOutline"
		clear-on-select
		density="compact"
		hide-details
		hide-no-data
		:items="items"
		:label="label"
		:loading="loading"
		:no-data-text="props.noResultLabel"
		no-filter
		persistent-clear
		persistent-placeholder
		:placeholder="placeholder"
		return-object
		:search="searchValue"
		single-line
		variant="solo"
		@click:clear="resetSearch"
		@update:search="startSearch">
		<template v-slot:item="{ item, index }">
			<v-list-item
				:active="false"
				class="product-item"
				max-width="450"
				density="compact"
				@click="resetSearch"
				:to="{ name: 'book', params: { id: item.value } }"
				v-intersect="index === items.length - 1 ? loadMore : undefined">
				<div class="d-flex align-center">
					<v-list-item-media class="flex-shrink-1 mr-4">
						<v-img
							max-height="75"
							max-width="75"
							min-width="50"
							min-height="50"
							:src="item.raw.image" />
					</v-list-item-media>
					<div class="desc">
						<v-list-item-title>{{ item.title }}</v-list-item-title>
						<v-list-item-subtitle>{{
							item.raw.authors.join(', ')
						}}</v-list-item-subtitle>
					</div>
				</div>
			</v-list-item>
		</template>
		<template v-slot:prepend-inner>
			<v-select
				ref="searchTypeSelector"
				center-affix
				hide-details
				v-model="searchType"
				v-model:menu="openSearchTypeSelector"
				:items="searchTypes"
				density="compact"
				variant="outlined">
				<template v-slot:item="{ item }">
					<v-list-item
						density="compact"
						:title="item.title"
						:value="item.value"
						:prepend-icon="item.raw.icon"
						@click="changeSearchType(item.value)" />
				</template>
				<template v-slot:selection="{ item }">
					<v-icon
						:icon="item.raw.icon"
						:size="24" />
				</template>
			</v-select>
		</template>
		<template v-slot:append-inner>
			<router-link
				@click="resetSearch"
				:to="{
					name: 'search',
					query: {
						terms: encodeURI(searchValue),
						type: searchType,
					},
				}">
				<v-icon
					size="24"
					:icon="mdiMagnify" />
			</router-link>
		</template>
	</v-autocomplete>
</template>

<style lang="scss">
	@import 'vuetify/lib/styles/settings/_colors';

	.v-autocomplete--single .v-field--dirty:not(.v-field--focused) input {
		opacity: 1 !important;
	}

	.v-autocomplete {
		> div .v-field > .v-field__append-inner {
			> .v-icon {
				display: none;
			}

			a .v-icon {
				opacity: 0.6;
			}
		}

		.v-field__prepend-inner .v-select {
			width: 32px;
			cursor: pointer;

			&__selection {
				border-right: 1px solid grey;
				padding-right: 8px;
			}

			.v-field__append-inner {
				width: 14px;

				i {
					opacity: 0.6;
					position: relative;
					left: -12px;
				}
			}

			.v-field__input {
				padding: 0;
				opacity: 0.6;
				cursor: pointer;

				input {
					display: none !important;
				}
			}

			.v-field__outline > * {
				border: 0 !important;
			}

			.v-field {
				display: flex !important;
				cursor: pointer;

				.v-field__field {
					order: 4;
				}
			}
		}

		.v-field__field .v-field__input {
			padding-left: 8px;
		}
	}

	.v-autocomplete__content {
		max-width: 450px !important;

		.v-list {
			padding: 0;
		}
	}

	.product-item {
		.v-list-item-media {
			width: 75px;
			min-width: 75px;
		}

		.v-list-item-title {
			white-space: normal;
		}

		.v-list-item__overlay {
			background: none !important;
		}

		&:hover .v-list-item__overlay {
			background-color: map-get($grey, 'darken-4') !important;
		}

		.desc {
			max-width: 355px;
		}
	}
</style>

<style scoped lang="scss">
	.v-autocomplete {
		max-width: 450px;
	}
</style>
