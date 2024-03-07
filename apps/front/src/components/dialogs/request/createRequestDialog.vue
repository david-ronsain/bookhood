<script setup lang="ts">
	import { BhPrimaryButton, BhDialog, BhDatePickerMenu } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'
	import { format } from 'date-fns'

	const { t } = useI18n({})
	const marker = ref<google.maps.Marker | null>(null)
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const borrowDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const disabled = ref<boolean>(false)
	const dates = ref<Date[]>([])

	const profile = computed(() => mainStore.profile)

	const borrow = (libraryId: string): void => {
		requestStore
			.create(libraryId, [
				format(dates.value[0], 'yyyy-MM-dd'),
				format(dates.value[1], 'yyyy-MM-dd'),
			])
			.then(() => {
				borrowDialog.value.close()
				mainStore.success = t('request.createDialog.success')
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
				disabled.value = false
			})
			.finally(() => {
				loading.value = false
				dates.value = []
			})
	}

	const open = (markerPicked: google.maps.Marker): void => {
		marker.value = markerPicked
		borrowDialog.value.open()
	}

	const datesSelected = (values: Date[]) => {
		dates.value = values
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
			<div
				class="mb-4"
				v-text="
					$t('request.createDialog.text', {
						book: marker?.['book']?.title,
					})
				" />

			<div v-text="$t('request.createDialog.dates')" />

			<bh-date-picker-menu
				readonly
				:minDate="new Date()"
				multiple="range"
				@datesSelected="datesSelected" />
		</template>
		<template v-slot:actions>
			<bh-primary-button
				:text="$t('common.no')"
				no-background
				@click="borrowDialog?.close()" />
			<bh-primary-button
				:text="$t('common.yes')"
				@click="borrow(marker?.['book']?.libraryId)"
				:disabled="
					!marker || disabled || !profile || dates.length !== 2
				"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>

<style lang="scss" scoped>
	table {
		width: 100%;
	}
</style>
