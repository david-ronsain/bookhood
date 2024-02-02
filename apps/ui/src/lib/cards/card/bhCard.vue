<script setup lang="ts">
	import { type IBhCardProps } from '../../../interfaces/bhCard.interface'

	const props = withDefaults(defineProps<IBhCardProps>(), {
		hover: true,
	})
</script>

<template>
	<v-card
		density="compact"
		:hover="props.hover"
		rounded
		:to="to">
		<v-card-title v-if="title">
			{{ title }}
		</v-card-title>
		<div
			v-else
			class="v-card-title">
			<slot name="title"></slot>
		</div>

		<v-card-subtitle v-if="subtitle">
			{{ subtitle }}
		</v-card-subtitle>
		<div
			v-else
			class="v-card-subtitle">
			<slot name="subtitle"></slot>
		</div>

		<v-card-text v-if="text">
			{{ text }}
		</v-card-text>
		<div
			v-else
			class="v-card-text">
			<slot name="text"></slot>
		</div>
		<slot name="default"></slot>
		<slot name="actions"></slot>
	</v-card>
</template>

<style scoped lang="scss">
	.v-card-title {
		text-align: center;
	}
</style>
