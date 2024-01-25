<script setup lang="ts">
	import { computed } from 'vue'
	import { mdiCheckboxBlankOutline, mdiCheckboxMarkedOutline } from '@mdi/js'

	export interface BhCheckBoxIconProp {
		append?: string
		prepend?: string
	}
	export interface BhCheckBoxProps {
		color?: string
		disabled?: boolean
		icon?: BhCheckBoxIconProp
		label?: string
		multiple?: boolean
		readonly?: boolean
	}
	const props = withDefaults(defineProps<BhCheckBoxProps>(), {
		disabled: false,
		multiple: false,
		readonly: false,
	})

	const appendIcon = computed(() =>
		props?.icon?.append ? props.icon.append : undefined
	)
	const prependIcon = computed(() =>
		props?.icon?.prepend ? props.icon.prepend : undefined
	)
</script>

<template>
	<v-checkbox
		:append-icon="appendIcon"
		:color="color"
		:disabled="disabled"
		:false-icon="mdiCheckboxBlankOutline"
		hide-details="auto"
		:icon="icon"
		:label="label"
		:multiple="multiple"
		:prepend-icon="prependIcon"
		:readonly="readonly"
		:true-icon="mdiCheckboxMarkedOutline" />
</template>

<style lang="scss">
	.v-checkbox {
		.v-selection-control__wrapper {
			width: auto;

			.v-selection-control__input {
				width: auto;
				height: auto;
				margin-right: 12px;
				margin-left: -2px;
			}
		}
		.v-input__details {
			margin-top: -16px;
		}
	}
</style>
