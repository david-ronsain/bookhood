<script setup lang="ts">
	import { mdiCheck } from '@mdi/js'

	defineProps<{
		tooltip: string
	}>()

	const events = defineEmits(['status:validated'])
</script>

<template>
	<v-tooltip :text="tooltip">
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				class="mr-2"
				icon
				size="20"
				color="green"
				@click="events('status:validated')">
				<v-icon
					size="20"
					color="white">
					{{ mdiCheck }}
				</v-icon>
			</v-btn>
		</template>
	</v-tooltip>
</template>
