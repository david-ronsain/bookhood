<script setup lang="ts">
	import { BhPrimaryButton, BhDialog } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { isAuthenticated } from '../../../plugins/authentication'
	import { useI18n } from 'vue-i18n'

	const { t } = useI18n({})
	const marker = ref<google.maps.Marker | null>(null)
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const borrowDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const disabled = ref<boolean>(false)

	const borrow = (libraryId: string): void => {
		requestStore
			.create(libraryId)
			.then(() => {
				borrowDialog.value.close()
				loading.value = false
				mainStore.success = t('request.createDialog.success')
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				loading.value = false
				disabled.value = false
			})
	}

	const open = (markerPicked: google.maps.Marker): void => {
		marker.value = markerPicked
		borrowDialog.value.open()
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="borrowDialog"
		:title="$t('request.createDialog.title')">
		<template v-slot:default>
			{{
				$t('request.createDialog.text', {
					book: marker?.['book']?.title,
				})
			}}
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('common.no')"
				no-background
				@click="borrowDialog?.close()" />
			<bh-primary-button
				:text="$t('common.yes')"
				@click="borrow(marker?.['book']?.libraryId)"
				:disabled="!marker || disabled || !isAuthenticated"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
