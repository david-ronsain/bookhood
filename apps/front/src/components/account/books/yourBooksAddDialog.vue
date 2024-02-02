<script setup lang="ts">
	import { ref } from 'vue'
	import {
		BhDialog,
		BhPrimaryButton,
		BhTextField,
		BhBookArticle,
	} from '@bookhood/ui'
	import { type IBook } from '@bookhood/shared'
	import { mdiAlertCircleOutline, mdiMagnify } from '@mdi/js'
	import debounce from 'debounce'
	import { StreamBarcodeReader } from 'vue-barcode-reader'
	import { watch } from 'vue'
	import { useMainStore, useBookStore } from '../../../store'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const addDialog = ref(null)
	const hasCamera = ref(false)
	const bookStore = useBookStore()
	const mainStore = useMainStore()
	const search = ref('')
	const book = ref<IBook>(null)
	const loading = ref<boolean>(false)
	const saveButtonLoading = ref<boolean>(false)
	const saveButtonDisabled = ref<boolean>(true)
	const lastSearch = ref<string>('')
	const displayBookNotFound = ref<boolean>(false)

	watch(book, (newVal) => {
		saveButtonDisabled.value = !newVal
	})

	const checkHasCamera = async () => {
		const devices = await navigator.mediaDevices.enumerateDevices()
		hasCamera.value =
			devices.filter((device) => device.kind === 'videoinput').length > 0
	}
	checkHasCamera()

	const open = () => {
		addDialog.value?.open()
	}

	const debouncedSearch = debounce(async (): Promise<void> => {
		if (search.value.length && search.value !== lastSearch.value) {
			book.value = null
			book.value = await bookStore.searchGoogleByISBN(search.value)
			displayBookNotFound.value = book.value === null
			lastSearch.value = search.value
			loading.value = false
		}
	}, 750)

	const startSearch = () => {
		if (search.value.length > 0 && search.value !== lastSearch.value) {
			loading.value = true
			displayBookNotFound.value = false
			debouncedSearch()
		} else {
			loading.value = false
		}
	}

	const readBarCode = ({ text }) => {
		if (text.length) {
			search.value = text
			startSearch()
		}
	}

	const save = () => {
		saveButtonDisabled.value = true
		saveButtonLoading.value = true
		bookStore
			.add(book.value)
			.then(() => {
				mainStore.success = t(
					'account.books.yourBooks.addForm.success',
					{ title: book.value.title }
				)
				addDialog.value.close()
				book.value = null
			})
			.catch((err) => {
				mainStore.error = t(err.response.data.message, {
					title: book.value.title,
					reason: err.response.data.message,
				})
				saveButtonDisabled.value = false
			})
			.finally(() => {
				saveButtonLoading.value = false
			})
	}

	const reset = () => {
		book.value = null
		lastSearch.value = null
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		:title="$t('account.books.yourBooks.addForm.title')"
		ref="addDialog"
		fullscreen>
		<template v-slot>
			<div
				id="barcodeScanner"
				v-if="hasCamera">
				<div v-text="$t('account.books.yourBooks.addForm.scan')" />
				<StreamBarcodeReader @result="readBarCode" />
			</div>

			<bh-text-field
				style="max-width: 400px"
				class="mx-auto"
				ref="isbnSearch"
				:label="$t('account.books.yourBooks.addForm.searchISBN')"
				v-model="search"
				clearable
				:icon="{ icon: mdiMagnify, append: true }"
				@click:append="startSearch"
				@blur="startSearch"
				@click:clear="reset"
				@update:modelValue="startSearch" />

			<bh-book-article
				class="px-4 py-8 ma-auto"
				v-if="book"
				:book="book" />
			<v-alert
				v-else-if="displayBookNotFound"
				max-width="400"
				class="mx-auto my-8"
				color="warning"
				:icon="mdiAlertCircleOutline"
				:text="$t('account.books.yourBooks.addForm.bookNotFound')" />
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('account.books.yourBooks.addForm.close')"
				no-background
				@click.prevent="addDialog.close()" />

			<bh-primary-button
				:text="$t('account.books.yourBooks.addForm.add')"
				:loading="saveButtonLoading"
				:disabled="saveButtonDisabled"
				@click.prevent="save" />
		</template>
	</bh-dialog>
</template>

<style lang="scss" scoped>
	#barcodeScanner {
		max-width: 400px;
		max-height: 400px;
		margin: 0 auto 32px;
	}
</style>
