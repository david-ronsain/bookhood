<script setup lang="ts">
	import { mdiPlusCircleOutline } from '@mdi/js'
	import CreateBookDialog from '../components/dialogs/book/createBookDialog.vue'
	import YourBooks from '../components/account/books/yourBooks/yourBooks.vue'
	import { ref } from 'vue'
	import { BhPrimaryButton } from '@bookhood/ui'

	const addDialog = ref(null)
	const profileCard = ref(null)
</script>

<template>
	<v-container
		fluid
		id="profile">
		<v-row>
			<v-col
				cols="12"
				class="d-flex justify-end">
				<bh-primary-button
					class="add-book"
					:text="$t('account.books.myProfile.add')"
					:icon="{ icon: mdiPlusCircleOutline, prepend: true }"
					@click="addDialog.open()" />
			</v-col>
		</v-row>

		<v-row>
			<v-col
				cols="12"
				md="4">
			</v-col>
			<v-col
				cols="12"
				md="8">
				<your-books />
			</v-col>
		</v-row>

		<create-book-dialog
			class="add-book-dialog"
			ref="addDialog"
			@bookCreated="profileCard?.loadBooks()" />
	</v-container>
</template>
