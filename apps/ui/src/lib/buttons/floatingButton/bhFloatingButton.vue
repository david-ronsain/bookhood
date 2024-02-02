<script setup lang="ts">
	import { type IBhFloatingButtonProps } from '../../../interfaces/bhFloatingButton.interface'

	defineProps<IBhFloatingButtonProps>()
</script>

<template>
	<v-btn
		class="bh-floating-button-right"
		density="compact"
		:icon="icon"
		location="center right"
		position="absolute"
		color="primary"
		size="small" />
</template>

<style scoped lang="scss">
	.bh-floating-button-right {
		right: 8px !important;
	}
</style>
