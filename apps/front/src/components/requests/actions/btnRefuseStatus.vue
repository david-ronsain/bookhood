<script setup lang="ts">
	import { mdiClose } from '@mdi/js'

	defineProps<{
		tooltip: string
	}>()

	const events = defineEmits(['status:refused'])
</script>

<template>
	<v-tooltip :text="tooltip">
		<template v-slot:activator="{ props }">
			<v-btn
				v-bind="props"
				class="mr-2"
				icon
				size="20"
				color="primary"
				@click="events('status:refused')">
				<v-icon
					size="20"
					color="white">
					{{ mdiClose }}
				</v-icon>
			</v-btn>
		</template>
	</v-tooltip>
</template>
