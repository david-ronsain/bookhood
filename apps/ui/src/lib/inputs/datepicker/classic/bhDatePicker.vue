<script setup lang="ts">
	import { ref, onMounted } from 'vue'
	import { format } from 'date-fns'

	export interface BhDatePickerProps {
		minDate?: Date
		maxDate?: Date
		multiple?: boolean | 'range'
		dates?: Date[]
		availableDates?: string[]
	}

	const properties = withDefaults(defineProps<BhDatePickerProps>(), {
		multiple: false,
	})

	const model = ref<Date[] | undefined>([])

	const selectDate = () => {
		if (
			properties.multiple &&
			model.value &&
			model.value.length >= 2 &&
			properties.availableDates?.length &&
			!model.value.every((date: Date) =>
				properties.availableDates?.includes(format(date, 'yyyy-MM-dd')),
			)
		) {
			model.value = []
		}
		if (!properties.multiple || (model.value && model.value.length > 1)) {
			events('dateSelected', model.value)
		}
	}

	onMounted(() => {
		model.value = properties.dates
	})

	const events = defineEmits(['dateSelected'])
</script>

<template>
	<v-date-picker
		:allowedDates="availableDates"
		color="primary"
		hide-header
		:max="maxDate"
		:min="minDate"
		v-model="model"
		:multiple="multiple"
		show-adjacent-months
		@update:modelValue="selectDate"></v-date-picker>
</template>

<style lang="scss"></style>
