<script setup lang="ts">
	import SearchList from './searchList.vue'
	import CreateRequestDialog from '../dialogs/request/createRequestDialog.vue'
	import SearchFields from './searchFields.vue'
	import SearchMap from './searchMap.vue'

	import { ref, onMounted } from 'vue'
	import { type IBookSearchResult } from '@bookhood/shared'
	import debounce from 'debounce'
	import { useBookStore } from '../../store'
	import { useDisplay } from 'vuetify'

	const loading = ref<boolean>(false)
	const pickedBook = ref<string[]>([])
	const books = ref<IBookSearchResult[]>([])
	const borrowDialog = ref<typeof CreateRequestDialog | null>(null)
	const fields = ref<typeof SearchFields | null>(null)
	const map = ref<typeof SearchMap | null>(null)
	const boundingBox = ref<number[]>([])
	const nbResults = ref<number>(0)
	const bookStore = useBookStore()
	const searchStarted = ref<boolean>(false)
	const { mdAndUp } = useDisplay()

	const search = () => {
		map.value?.removeMarkers()
		searchStarted.value = true
		loading.value = true

		debouncedSearch()
	}

	const debouncedSearch = debounce(async () => {
		const startAt = fields.value?.form.page * 10
		boundingBox.value = map.value?.getBoundingBox()

		if (
			(nbResults.value > 0 && startAt < nbResults.value) ||
			nbResults.value === 0 ||
			fields.value?.form.page === 0
		) {
			const results = await bookStore.searchByName(
				fields.value?.form,
				startAt,
				boundingBox.value,
			)
			nbResults.value = parseInt(results.data.total)
			books.value = results.data.results.map(
				(book: IBookSearchResult) => ({
					...book,
					value: book._id,
				}),
			)
			pickedBook.value = map.value?.markerPicked
				? [map.value?.markerPicked?.book._id]
				: []

			loading.value = false
			map.value?.setMarkers(books.value)
		}
		loading.value = false
	}, 750)

	const reset = () => {
		loading.value = true
		fields.value?.resetPage()
		nbResults.value = 0
		search()
	}

	const wantToBorrow = (book: IBookSearchResult): void => {
		map.value?.pickMarker(book)
		borrowDialog.value?.open(map.value?.markerPicked)
	}

	const centerChanged = (point: number[]) => {
		map.value?.setCenter({ lat: point[1], lng: point[0] })
	}

	onMounted(() => {
		search()
	})
</script>

<template>
	<div>
		<v-row>
			<v-col
				cols="12"
				class="pb-0 pb-md-4">
				<search-fields
					ref="fields"
					@center:changed="(center) => centerChanged(center)"
					@reset="reset"
					@search="search" />
			</v-col>
		</v-row>

		<v-row>
			<v-col
				cols="12"
				md="7"
				class="d-md-flex d-none">
				<search-map
					v-if="mdAndUp"
					@search="search"
					@book:picked="(e) => (pickedBook = e)"
					ref="map" />
			</v-col>
			<v-col
				cols="12"
				md="5">
				<div
					class="loaders"
					v-if="loading || !searchStarted">
					<v-skeleton-loader
						width="100%"
						v-for="index in 4"
						:key="index"
						type="list-item-avatar-two-line" />
				</div>
				<search-list
					v-else-if="books?.length"
					:books="books"
					:picked-book="pickedBook"
					:highlighted-marker="map?.highlightedMarker"
					@click:marker="(book) => map?.pickMarker(book)"
					@mouseover:marker="(book) => map?.highlightMarker(book)"
					@mouseout:marker="map?.unhighlightMarkers"
					@click:borrow="(book) => wantToBorrow(book)" />
				<div v-else>
					{{ $t('search.noResult') }}
				</div>
				<create-request-dialog ref="borrowDialog" />
			</v-col>
		</v-row>
	</div>
</template>

<style lang="scss" scoped>
	.loaders {
		width: 100%;
	}
</style>
