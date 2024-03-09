<script setup lang="ts">
	import { BhPrimaryButton, BhDialog, BhDatePickerMenu } from '@bookhood/ui'
	import { ref } from 'vue'
	import { useRequestStore, useMainStore } from '../../../store'
	import { useI18n } from 'vue-i18n'
	import { computed } from 'vue'
	import { useDate } from 'vuetify'
	import { format } from 'date-fns'

	const date = useDate()
	const { t } = useI18n({})
	const requestStore = useRequestStore()
	const mainStore = useMainStore()
	const acceptDialog = ref<BhDialog>(null)
	const loading = ref<boolean>(false)
	const request = ref<string>('')
	const dates = ref<Date[]>([])
	const currentDates = ref<Date[]>([])

	const profile = computed(() => mainStore.profile)
	const disabled = computed(
		() => currentDates.value.length === 0 || loading.value,
	)

	const accept = (): void => {
		loading.value = true

		requestStore
			.accept(request.value, [
				format(dates.value[0], 'yyyy-MM-dd'),
				format(dates.value[1], 'yyyy-MM-dd'),
			])
			.then(() => {
				close()
				mainStore.success = t('request.acceptDialog.success')
				requestStore.getIncomingRequests({
					ownerId: profile.value?._id,
				})
			})
			.catch((err) => {
				mainStore.error = err.response.data.message
			})
			.finally(() => {
				loading.value = false
				dates.value = []
				currentDates.value = []
			})
	}

	const open = (
		requestId: string,
		startDate: string,
		endDate: string,
	): void => {
		if ('open' in acceptDialog.value) acceptDialog.value.open()

		request.value = requestId
		dates.value = [new Date(startDate), new Date(endDate)]

		const diff = date.getDiff(endDate, startDate, 'days')
		let tmp = new Date(startDate)

		for (let i = 0; i <= diff; i++) {
			currentDates.value.push(tmp)
			tmp = date.addDays(tmp, 1) as unknown as Date
		}
	}

	const close = (): void => {
		if ('close' in acceptDialog.value) acceptDialog.value.close()
		request.value = ''
		dates.value = []
		currentDates.value = []
	}

	const datesSelected = (values: Date[]): void => {
		dates.value = values
	}

	defineExpose({
		open,
	})
</script>

<template>
	<bh-dialog
		ref="acceptDialog"
		:title="$t('request.acceptDialog.title')">
		<template v-slot:default>
			<div v-text="$t('request.acceptDialog.text')" />

			<bh-date-picker-menu
				:locales="{
					dateLabel: $t('request.createDialog.fromTo', {
						date1: '{date1}',
						date2: '{date2}',
					}),
				}"
				:currentDates="currentDates"
				readonly
				:minDate="new Date()"
				multiple
				@datesSelected="datesSelected" />
		</template>
		<template v-slot:actions>
			<bh-primary-button
				class="not-accept-request"
				:text="$t('common.no')"
				no-background
				@click="close" />
			<bh-primary-button
				class="accept-request"
				:text="$t('common.yes')"
				@click="accept"
				:disabled="disabled"
				:loading="loading" />
		</template>
	</bh-dialog>
</template>
