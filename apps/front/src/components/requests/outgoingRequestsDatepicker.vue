<script setup lang="ts">
	import { BhDatePickerMenu } from '@bookhood/ui'
	import { ref } from 'vue'
	import { onMounted } from 'vue'
	import { watch } from 'vue'
	import { useDate } from 'vuetify'

	interface OutgoingRequestDatepickerProps {
		dates: Date[]
		minDate: Date
	}

	const props = defineProps<OutgoingRequestDatepickerProps>()

	const date = useDate()
	const events = defineEmits(['datesSelected'])
	const currentDates = ref<Date[]>([])

	const setCurrentDates = () => {
		currentDates.value = []
		const diff = date.getDiff(props.dates[1], props.dates[0], 'days')
		let tmp = new Date(props.dates[0])

		for (let i = 0; i <= diff; i++) {
			currentDates.value.push(tmp)
			tmp = date.addDays(tmp, 1) as unknown as Date
		}
	}

	onMounted(() => {
		setCurrentDates()
	})

	watch(props, () => {
		setCurrentDates()
	})
</script>

<template>
	<bh-date-picker-menu
		:clearable="false"
		:currentDates="currentDates"
		readonly
		:minDate="minDate"
		multiple="range"
		@datesSelected="(dates) => events('datesSelected', dates)" />
</template>
