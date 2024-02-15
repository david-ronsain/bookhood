<script setup lang="ts">
	defineProps<{
		tooltip: string
		icon: any
	}>()

	const events = defineEmits(['clicked'])
</script>

<template>
	<v-tooltip :text="tooltip">
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				class="mr-2"
				icon
				size="20"
				color="info"
				@click="events('clicked')">
				<v-icon
					size="20"
					color="white">
					{{ icon }}
				</v-icon>
			</v-btn>
		</template>
	</v-tooltip>
</template>
