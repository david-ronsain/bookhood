<script setup lang="ts">
	export interface IBhFloatingButtonProps {
		icon: string
	}
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
