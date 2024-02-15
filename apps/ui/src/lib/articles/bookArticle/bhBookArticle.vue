<script setup lang="ts">
	import { default as BhCard } from '../../cards/card/bhCard.vue'

	export interface IBhBookArticleProps {
		book: IBhBook
	}

	export interface IBhBook {
		isbn?: string
		title: string
		authors: string[]
		categories: string[]
		description: string[]
		image: { smallThumbnail: string; thumbnail: string }
		language: string
		subtitle: string
		publisher: string
		publishedDate: string
	}

	defineProps<IBhBookArticleProps>()
</script>

<template>
	<bh-card
		max-width="800"
		flat
		:hover="false"
		:title="book.title">
		<template v-slot:text>
			<div class="d-flex align-center">
				<v-img
					v-if="book.image"
					class="mr-12"
					:src="book.image.thumbnail"
					max-width="300"
					max-height="300"
					min-width="150"
					min-height="150" />

				<div>
					<div v-text="book.authors.join(', ')" />
					<div v-text="book.categories.join(', ')" />
					<div v-text="book.description" />
				</div>
			</div>
		</template>
	</bh-card>
</template>

<style scoped></style>
