<script setup lang="ts">
	import { BhCard, BhFloatingButton } from '@bookhood/ui'
	import { mdiPlus } from '@mdi/js'
	import { ref } from 'vue'
	import YourBooksAddDialog from './yourBooksAddDialog.vue'

	const addDialog = ref(null)
</script>

<template>
	<div>
		<bh-card :to="{ name: 'yourBooks' }">
			<template v-slot:title>
				<span>
					{{ $t('account.books.yourBooks.title') }}
				</span>

				<bh-floating-button
					:icon="mdiPlus"
					@click.prevent="addDialog.open()" />
			</template>
			<template v-slot:text>
				<div>bfgeiozgbo</div>
			</template>
		</bh-card>

		<your-books-add-dialog ref="addDialog" />
	</div>
</template>
