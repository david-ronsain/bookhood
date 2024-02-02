<script setup lang="ts">
	import { type IBhBookArticleProps } from '../../../interfaces/bhBookArticle.interface'
	import { default as BhCard } from '../../cards/card/bhCard.vue'
	defineProps<IBhBookArticleProps>()
</script>

<template>
	<bh-card
		max-width="800"
		flat
		:hover="false"
		:class="`book-${book.isbn}`"
		:title="book.title">
		<template v-slot:text>
			<div class="d-flex">
				<v-img
					class="mr-12"
					:src="book.image"
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
