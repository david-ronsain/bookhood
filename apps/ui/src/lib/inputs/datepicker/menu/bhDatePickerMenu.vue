<script setup lang="ts">
	import { ref, computed, defineEmits, onMounted, watch } from 'vue'
	import BhDatePicker from '../classic/bhDatePicker.vue'
	import BhTextField from '../../textField/bhTextField.vue'
	import { mdiCalendar } from '@mdi/js'
	import { useDate } from 'vuetify'

	const date = useDate()

	interface BhDatePickerMenuLocale {
		dateLabel: string
	}

	export interface BhDatePickerMenuProps {
		label?: string
		placeholder?: string
		readonly?: boolean
		minDate?: Date
		maxDate?: Date
		multiple?: boolean
		currentDates?: Date[]
		clearable?: boolean
		availableDates?: string[]
		locales: BhDatePickerMenuLocale
	}

	const properties = withDefaults(defineProps<BhDatePickerMenuProps>(), {
		readonly: false,
		multiple: false,
		clearable: true,
	})

	const model = ref<Date[]>([])
	const menuOpened = ref<boolean>(false)

	const displayDates = computed(() =>
		model.value.length === 0
			? ''
			: properties.multiple
				? properties.locales.dateLabel
						.replace(
							'{date1}',
							date.format(model.value[0], 'keyboardDate'),
						)
						.replace(
							'{date2}',
							date.format(
								model.value[model.value.length - 1],
								'keyboardDate',
							),
						)
				: date.format(model.value[0], 'keyboardDate'),
	)

	const closeMenu = () => {
		menuOpened.value = false
	}

	const clear = () => {
		model.value = []
		events('datesSelected', [])
	}

	const selectDate = (dates: Date[]) => {
		model.value = dates
		closeMenu()
		if (dates.length === 1) {
			events('datesSelected', [dates[0]])
		} else {
			events('datesSelected', [dates[0], dates[dates.length - 1]])
		}
	}

	const events = defineEmits(['datesSelected'])

	onMounted(() => {
		if (properties.currentDates && properties.currentDates.length) {
			model.value = properties.currentDates
		}
	})

	watch(properties, () => {
		if (Array.isArray(properties.currentDates)) {
			model.value = properties.currentDates
		}
	})
</script>

<template>
	<v-menu
		v-model="menuOpened"
		:close-on-content-click="false">
		<template v-slot:activator="{ props }">
			<bh-text-field
				v-bind="props"
				class="datepicker-editor"
				:clearable="clearable"
				density="compact"
				:icon="{
					appendInner: true,
					icon: mdiCalendar,
				}"
				:label="label"
				:placeholder="placeholder"
				:readonly="readonly"
				:variant="clearable ? 'outlined' : 'underlined'"
				v-model="model"
				:value="displayDates"
				@click:clear="clear" />
		</template>
		<bh-date-picker
			v-click-outside="closeMenu"
			:min-date="minDate"
			:max-date="maxDate"
			:multiple="multiple"
			:dates="model"
			:availableDates="availableDates"
			@dateSelected="selectDate" />
	</v-menu>
</template>

<style lang="scss">
	.datepicker-editor {
		min-width: 200px;
	}
</style>
