<script setup lang="ts">
	import { ref } from 'vue'
	import {
		BhDialog,
		BhPrimaryButton,
		BhTextField,
		BhBookArticle,
		BhAddressAutocomplete,
	} from '@bookhood/ui'
	import {
		type IAddBookDTO,
		type ICoords,
		LibraryStatus,
	} from '@bookhood/shared'
	import { mdiAlertCircleOutline, mdiMagnify } from '@mdi/js'
	import debounce from 'debounce'
	import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
	import { watch } from 'vue'
	import { useMainStore, useBookStore } from '../../../store'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const addDialog = ref(null)
	const hasCamera = ref(false)
	const bookStore = useBookStore()
	const mainStore = useMainStore()
	const search = ref('')
	const book = ref<IAddBookDTO>(null)
	const loading = ref<boolean>(false)
	const saveButtonLoading = ref<boolean>(false)
	const saveButtonDisabled = ref<boolean>(true)
	const lastSearch = ref<string>('')
	const displayBookNotFound = ref<boolean>(false)
	const location = ref<{ lat; lng }>()
	const place = ref<string>('')
	const status = ref<LibraryStatus>(LibraryStatus.TO_LEND)

	watch(book, (newVal: IAddBookDTO) => {
		saveButtonDisabled.value =
			isNaN(location.value?.lat) ||
			isNaN(location.value?.lng) ||
			!newVal ||
			!status.value
	})

	watch(location, (newVal: ICoords) => {
		saveButtonDisabled.value =
			isNaN(newVal.lat) ||
			isNaN(newVal.lng) ||
			!book.value ||
			!status.value
	})

	watch(status, (newVal: LibraryStatus) => {
		saveButtonDisabled.value =
			isNaN(location.value.lat) ||
			isNaN(location.value.lng) ||
			!book.value ||
			!newVal
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
			.add(book.value, status.value, location.value, place.value)
			.then(() => {
				mainStore.success = t(
					'account.books.yourBooks.addForm.success',
					{ title: book.value.title },
				)
				addDialog.value.close()
				book.value = null
				events('bookCreated')
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

	const centerUpdated = (center: number[]) => {
		location.value = {
			lng: parseFloat(center[0].toString()),
			lat: parseFloat(center[1].toString()),
		}
	}

	const placeUpdated = (name: string) => {
		place.value = name
	}

	const events = defineEmits(['bookCreated'])

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
			<div class="d-flex flex-wrap">
				<div class="v-col v-col-12 v-col-md-6">
					<div
						v-if="hasCamera"
						id="barcodeScanner"
						class="mb-4 mx-auto">
						<div
							v-text="
								$t('account.books.yourBooks.addForm.scan')
							" />
						<StreamBarcodeReader @result="readBarCode" />
					</div>
					<div class="mx-auto form">
						<bh-text-field
							style="max-width: 400px"
							class="mx-auto mb-4 create-book-isbn-search"
							ref="isbnSearch"
							:label="
								$t('account.books.yourBooks.addForm.searchISBN')
							"
							v-model="search"
							clearable
							:icon="{ icon: mdiMagnify, append: true }"
							@click:append="startSearch"
							@blur="startSearch"
							@click:clear="reset"
							@update:modelValue="startSearch" />

						<v-radio-group
							class="mb-4 mx-auto"
							inline
							v-model="status"
							hide-details>
							<v-radio
								v-for="key in Object.keys(LibraryStatus)"
								:key="'status-' + key"
								:label="
									$t(
										'account.books.yourBooks.addForm.status.' +
											key,
									)
								"
								:value="LibraryStatus[key]" />
						</v-radio-group>

						<bh-address-autocomplete
							class="mb-8"
							:placeholder="
								$t('account.books.yourBooks.addForm.address')
							"
							@center:updated="centerUpdated"
							@place:updated="placeUpdated" />
					</div>
				</div>

				<div class="v-col v-col-12 v-col-md-6">
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
						:text="
							$t('account.books.yourBooks.addForm.bookNotFound')
						" />
				</div>
			</div>
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('account.books.yourBooks.addForm.close')"
				no-background
				@click.prevent="addDialog.close()" />

			<bh-primary-button
				class="create-book"
				:text="$t('account.books.yourBooks.addForm.add')"
				:loading="saveButtonLoading"
				:disabled="saveButtonDisabled"
				@click.prevent="save" />
		</template>
	</bh-dialog>
</template>

<style lang="scss" scoped>
	#barcodeScanner {
		width: 400px;
	}

	.form {
		max-width: 400px;
	}
</style>

<style lang="scss">
	@media screen and (orientation: landscape) {
		video {
			height: 200px !important;
			max-height: 200px !important;
			width: 400px !important;
		}
	}
</style>
