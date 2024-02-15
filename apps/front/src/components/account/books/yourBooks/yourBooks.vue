<script setup lang="ts">
	import { mdiPlusCircleOutline } from '@mdi/js'
	import { ref } from 'vue'
	import CreateBookDialog from '../../../dialogs/book/createBookDialog.vue'
	import { BhPrimaryButton } from '@bookhood/ui'
	import { useBookStore } from '../../../../store'
	import { onMounted } from 'vue'
	import type { ILibraryFull } from '@bookhood/shared'

	const addDialog = ref(null)
	const store = useBookStore()
	const books = ref<ILibraryFull>([])

	onMounted(async () => {
		books.value = await store.loadBooks()
	})
</script>

<template>
	<div>
		<div class="d-flex align-center justify-end">
			<bh-primary-button
				:text="$t('account.books.yourBooks.add')"
				:icon="{ icon: mdiPlusCircleOutline, prepend: true }"
				@click="addDialog.open()" />
		</div>

		<div class="d-flex flex-wrap">
			<div
				class="v-col v-col-6 v-col-md-4 col-lg-3"
				v-for="book in books"
				:key="`book-${book._id}`">
				<v-card
					hover
					:title="book.book.title"
					:subtitle="book.book.authors.join(', ')"
					:to="{}">
					<template v-slot:text>
						<div class="d-flex align-center">
							<v-img
								class="mr-4"
								v-if="book.book.image"
								:src="book.book.image.smallThumbnail"
								max-height="100"
								max-width="75"
								min-width="50"
								min-height="65" />

							<div
								v-text="
									book.book.description.substring(0, 100)
								" />
						</div>
					</template>
				</v-card>
			</div>
		</div>

		<create-book-dialog ref="addDialog" />
	</div>
</template>
