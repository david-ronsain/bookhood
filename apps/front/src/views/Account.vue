<script setup lang="ts">
	import YourBooks from '../components/account/books/yourBooks.vue'
</script>

<template>
	<v-container
		fluid
		id="your-books">
		<v-row></v-row>

		<v-row>
			<v-col
				cols="12"
				md="4">
				<your-books />
			</v-col>
		</v-row>
	</v-container>
</template>
