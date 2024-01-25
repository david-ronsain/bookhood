<script setup lang="ts">
	import { computed } from 'vue'
	import { mdiCloseCircleOutline } from '@mdi/js'

	export interface BhTextFieldIconProp {
		icon: string
		prepend?: boolean
		append?: boolean
	}
	export interface BhTextFieldProps {
		autofocus?: boolean
		clear?: boolean
		icon?: BhTextFieldIconProp
		label?: string
		placeholder?: string
		type?: string
	}

	const props = withDefaults(defineProps<BhTextFieldProps>(), {
		autofocus: false,
		clear: false,
		type: 'text',
	})

	const prependIcon = computed(() =>
		props.icon && props.icon.prepend ? props.icon.icon : null
	)
	const appendIcon = computed(() =>
		props.icon && props.icon.icon && props.icon.append
			? props.icon.icon
			: null
	)
	const capitalizedLabel = computed(() =>
		props.label
			? new String(props.label).charAt(0).toUpperCase() +
			  new String(props.label).slice(1).toLowerCase()
			: ''
	)
	const capitalizedPlaceholder = computed(() =>
		props.placeholder
			? new String(props.placeholder).charAt(0).toUpperCase() +
			  new String(props.placeholder).slice(1).toLowerCase()
			: ''
	)
</script>

<template>
	<v-text-field
		variant="underlined"
		:prepend-icon="prependIcon"
		:append-icon="appendIcon"
		:autofocus="autofocus"
		:clearable="clear"
		:clear-icon="mdiCloseCircleOutline"
		hide-details="auto"
		:label="capitalizedLabel"
		:placeholder="capitalizedPlaceholder"
		:type="type" />
</template>

<style scoped></style>
