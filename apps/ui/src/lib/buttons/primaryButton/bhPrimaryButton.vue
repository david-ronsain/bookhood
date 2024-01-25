<script setup lang="ts">
	import { computed } from 'vue'

	export interface BhPrimaryButtonToProp {
		name: string
	}
	export interface BhPrimaryButtonIcon {
		icon: any
		prepend?: boolean
		append?: boolean
	}
	export interface BhPrimaryButtonProps {
		to?: BhPrimaryButtonToProp
		text: string
		noBackground?: boolean
		loading?: boolean
		icon?: BhPrimaryButtonIcon
		disabled?: boolean
	}
	const props = withDefaults(defineProps<BhPrimaryButtonProps>(), {
		text: 'Submit',
		noBackground: false,
		loading: false,
		icon: undefined,
	})
	const capitalizedText = computed<string>(
		() =>
			new String(props.text).charAt(0).toUpperCase() +
			new String(props.text).slice(1).toLowerCase()
	)
	const prependIcon = computed(() =>
		props.icon && props.icon.prepend ? props.icon.icon : null
	)
	const appendIcon = computed(() =>
		props.icon && props.icon.icon && props.icon.append
			? props.icon.icon
			: null
	)
	const icon = computed(() =>
		props.icon &&
		props.icon.icon &&
		!props.icon.prepend &&
		!props.icon.append
			? props.icon.icon
			: null
	)
</script>

<template>
	<v-btn
		color="primary"
		:to="to"
		:text="capitalizedText"
		:loading="loading ?? false"
		:prepend-icon="prependIcon"
		:append-icon="appendIcon"
		:icon="icon"
		:variant="noBackground ? 'text' : 'elevated'"
		:disabled="disabled ?? false">
	</v-btn>
</template>

<style lang="scss" scoped>
	.v-btn {
		text-transform: none !important;
	}
</style>
