<script setup lang="ts">
	import { type IBhCardProps } from '../../../interfaces/bhCard.interface'

	const props = withDefaults(defineProps<IBhCardProps>(), {
		hover: true,
	})
</script>

<template>
	<v-card
		class="d-flex flex-column"
		density="compact"
		:hover="props.hover"
		rounded
		:to="to">
		<v-card-title v-if="title">
			{{ title }}
		</v-card-title>
		<div
			v-else-if="$slots.title"
			class="v-card-title">
			<slot name="title"></slot>
		</div>

		<v-card-subtitle v-if="subtitle">
			{{ subtitle }}
		</v-card-subtitle>
		<div
			v-else-if="$slots.subtitle"
			class="v-card-subtitle">
			<slot name="subtitle"></slot>
		</div>

		<v-card-text v-if="text">
			{{ text }}
		</v-card-text>
		<div
			v-else-if="$slots.text"
			class="v-card-text flex-grow-1 px-3 py-2">
			<slot name="text"></slot>
		</div>
		<slot name="default"></slot>
		<div
			class="v-card-actions"
			v-if="$slots.actions">
			<slot name="actions"></slot>
		</div>
	</v-card>
</template>

<style scoped lang="scss">
	.v-card-title {
		text-align: center;
	}

	.v-card-actions {
		display: block;
	}
</style>
