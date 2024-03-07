<script setup lang="ts">
	import { computed } from 'vue'
	import { mdiCloseCircleOutline, mdiLoading } from '@mdi/js'

	export interface BhTextFieldIconProp {
		icon: string
		prepend?: boolean
		append?: boolean
		appendInner?: boolean
		prependInner?: boolean
		disabled?: boolean
	}
	export interface BhTextFieldProps {
		autofocus?: boolean
		clear?: boolean
		density?: 'compact' | 'default' | 'comfortable'
		icon?: BhTextFieldIconProp
		label?: string
		placeholder?: string
		readonly?: boolean
		type?: string
		variant?:
			| 'underlined'
			| 'filled'
			| 'outlined'
			| 'plain'
			| 'solo'
			| 'solo-inverted'
			| 'solo-filled'
			| undefined
	}

	const props = withDefaults(defineProps<BhTextFieldProps>(), {
		autofocus: false,
		clear: false,
		type: 'text',
		variant: 'underlined',
		density: 'default',
		readonly: false,
	})

	const prependIcon = computed(() =>
		props.icon && props.icon.prepend ? props.icon.icon : null,
	)
	const appendIcon = computed(() =>
		props.icon && props.icon.icon && props.icon.append
			? props.icon.icon
			: null,
	)

	const prependInnerIcon = computed(() =>
		props.icon && props.icon.prependInner ? props.icon.icon : null,
	)
	const appendInnerIcon = computed(() =>
		props.icon && props.icon.icon && props.icon.appendInner
			? props.icon.icon
			: null,
	)
	const capitalizedLabel = computed(() =>
		props.label
			? new String(props.label).charAt(0).toUpperCase() +
				new String(props.label).slice(1).toLowerCase()
			: '',
	)
	const capitalizedPlaceholder = computed(() =>
		props.placeholder
			? new String(props.placeholder).charAt(0).toUpperCase() +
				new String(props.placeholder).slice(1).toLowerCase()
			: '',
	)
</script>

<template>
	<v-text-field
		:append-icon="appendIcon"
		:append-inner-icon="appendInnerIcon"
		:autofocus="autofocus"
		:class="
			(props.icon?.disabled ? 'icon-disabled' : 'icon-enabled') +
			' ' +
			(appendInnerIcon === mdiLoading ? 'loading-icon' : '')
		"
		:clearable="clear"
		:clear-icon="mdiCloseCircleOutline"
		:density="density"
		hide-details="auto"
		:label="capitalizedLabel"
		:placeholder="capitalizedPlaceholder"
		:prepend-icon="prependIcon"
		:prepend-inner-icon="prependInnerIcon"
		:readonly="readonly"
		:type="type"
		:variant="variant" />
</template>

<style lang="scss">
	@import 'vuetify/lib/styles/settings/_colors';

	@-webkit-keyframes rotating /* Safari and Chrome */ {
		from {
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@keyframes rotating {
		from {
			-ms-transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-ms-transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}

	.loading-icon div:not(.v-field__clearable) > .v-icon {
		-webkit-animation: rotating 1s linear infinite;
		-moz-animation: rotating 1s linear infinite;
		-ms-animation: rotating 1s linear infinite;
		-o-animation: rotating 1s linear infinite;
		animation: rotating 1s linear infinite;
	}

	.icon-enabled div:not(.v-field__clearable) > .v-icon {
		color: map-get($green, 'lighten-2');
		opacity: 1;
	}
</style>
