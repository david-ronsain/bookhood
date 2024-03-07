<script setup lang="ts">
	import { ref, onMounted } from 'vue'

	export interface BhDatePickerProps {
		minDate?: Date
		maxDate?: Date
		multiple?: boolean | 'range'
		dates?: Date[]
	}

	const properties = withDefaults(defineProps<BhDatePickerProps>(), {
		multiple: false,
	})

	const model = ref<Date[]>([])

	const selectDate = () => {
		if (!properties.multiple || model.value.length > 1) {
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
