<script setup lang="ts">
	import { onMounted, ref, watch } from 'vue'
	import { useDisplay } from 'vuetify'
	import { BhPrimaryButton } from '@bookhood/ui'
	import { type IBookSearchResult } from '@bookhood/shared'
	import { shortenText } from '../../composables/shortenText.composable'
	import { mdiMapMarkerOutline } from '@mdi/js'
	import { useMainStore } from '../../store'
	import { computed } from 'vue'

	const props = defineProps<{
		books: IBookSearchResult[]
		pickedBook: string[]
		highlightedMarker?: any
	}>()

	const events = defineEmits([
		'click:marker',
		'mouseover:marker',
		'mouseout:marker',
		'click:borrow',
	])

	const mainStore = useMainStore()
	const { sm, mobile } = useDisplay()
	const bookSelected = ref<string[]>([])

	const profile = computed(() => mainStore.profile)

	onMounted(() => {
		bookSelected.value = props.pickedBook
	})

	watch(props, () => {
		bookSelected.value = props.pickedBook
	})
</script>

<template>
	<v-list
		v-model:selected="bookSelected"
		return-object
		class="pt-0 books-list">
		<v-list-item
			:class="
				highlightedMarker?.['book']._id === book._id
					? 'highlighted'
					: ''
			"
			class="mb-2"
			v-for="book in books"
			:key="book._id"
			border
			rounded
			:value="book._id"
			:title="book.title"
			:subtitle="book.authors.join(',')"
			@click="events('click:marker', book)"
			@mouseover="events('mouseover:marker', book)"
			@mouseout="events('mouseout:marker')">
			<template v-slot:prepend>
				<v-img
					v-if="book.image"
					:src="book.image?.thumbnail"
					width="50"
					max-height="50" />
			</template>
			<template v-slot:default>
				<div
					v-show="
						sm ||
						mobile ||
						(bookSelected.length && bookSelected[0] === book._id) ||
						(highlightedMarker &&
							highlightedMarker.book._id === book._id)
					">
					<div class="mb-4">
						{{ shortenText(book.description, 100) }}
					</div>
					<div class="d-flex align-center justify-space-between">
						<div>
							<v-icon
								class="mr-2"
								size="20"
								color="red"
								>{{ mdiMapMarkerOutline }}</v-icon
							>
							{{ book.owner[0].place }}
						</div>
						<bh-primary-button
							v-if="profile"
							:text="$t('search.borrow')"
							@click.stop="events('click:borrow', book)" />
						<bh-primary-button
							v-else
							:to="{ name: 'signin' }"
							:text="$t('home.signin')" />
					</div>
				</div>
			</template>
		</v-list-item>
	</v-list>
</template>

<style lang="scss" scoped>
	.books-list,
	.loaders {
		width: 100%;
	}
</style>

<style lang="scss">
	.books-list .v-list-item.highlighted .v-list-item__overlay {
		opacity: calc(
			var(--v-hover-opacity) * var(--v-theme-overlay-multiplier)
		);
	}
</style>
