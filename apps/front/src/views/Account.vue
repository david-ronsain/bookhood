<script setup lang="ts">
	import { mdiPlusCircleOutline } from '@mdi/js'
	import CreateBookDialog from '../components/dialogs/book/createBookDialog.vue'
	import MyBooks from '../components/account/books/myBooks/myBooks.vue'
	import { computed, ref } from 'vue'
	import { BhPrimaryButton } from '@bookhood/ui'
	import { useMainStore } from '../store'
	import MyProfile from '../components/profile/myProfile.vue'

	const mainStore = useMainStore()

	const addDialog = ref(null)
	const profileCard = ref(null)

	const profile = computed(() => mainStore.profile)
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
				<my-profile :profile="profile" />
			</v-col>
			<v-col
				cols="12"
				md="8">
				<my-books />
			</v-col>
		</v-row>

		<create-book-dialog
			class="add-book-dialog"
			ref="addDialog"
			@bookCreated="profileCard?.loadBooks()" />
	</v-container>
</template>
