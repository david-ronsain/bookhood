<script setup lang="ts">
	import { BhDatePickerMenu } from '@bookhood/ui'
	import { type IRequestSimple } from '@bookhood/shared'
	import { ref } from 'vue'
	import { onMounted } from 'vue'
	import { watch } from 'vue'
	import { useDate } from 'vuetify'
	import { format } from 'date-fns'

	interface OutgoingRequestDatepickerProps {
		dates: Date[]
		minDate: Date
		item?: IRequestSimple
	}

	const props = defineProps<OutgoingRequestDatepickerProps>()

	const date = useDate()
	const events = defineEmits(['datesSelected'])
	const currentDates = ref<Date[]>([])
	const availableDates = ref<string[]>([])

	const setCurrentDates = () => {
		currentDates.value = []
		const diff = date.getDiff(props.dates[1], props.dates[0], 'days')
		let tmp = new Date(props.dates[0])

		for (let i = 0; i <= diff; i++) {
			currentDates.value.push(tmp)
			tmp = date.addDays(tmp, 1) as unknown as Date
		}
	}

	const setAvailableDates = () => {
		const datesNotAvailable: Date[] = []
		availableDates.value = []
		props.item?.requests.forEach((req: IRequestSimple) => {
			const diff = date.getDiff(req.endDate, req.startDate, 'days')
			let tmp = new Date(req.startDate)

			for (let i = 0; i <= diff; i++) {
				datesNotAvailable.push(format(tmp, 'yyyy-MM-dd'))
				tmp = date.addDays(tmp, 1) as unknown as Date
			}
		})

		const diff = date.getDiff(
			date.addMonths(new Date(), 12),
			new Date(),
			'days',
		)
		let tmp = new Date()

		for (let i = 0; i <= diff; i++) {
			if (!datesNotAvailable.includes(format(tmp, 'yyyy-MM-dd'))) {
				availableDates.value.push(format(tmp, 'yyyy-MM-dd'))
			}
			tmp = date.addDays(tmp, 1) as unknown as Date
		}
	}

	onMounted(() => {
		setCurrentDates()
		setAvailableDates()
	})

	watch(props, () => {
		setCurrentDates()
		setAvailableDates()
	})
</script>

<template>
	<bh-date-picker-menu
		:locales="{
			dateLabel: $t('request.createDialog.fromTo', {
				date1: '{date1}',
				date2: '{date2}',
			}),
		}"
		:availableDates="availableDates"
		:clearable="false"
		:currentDates="currentDates"
		readonly
		:minDate="minDate"
		multiple
		@datesSelected="(dates) => events('datesSelected', dates)" />
</template>
