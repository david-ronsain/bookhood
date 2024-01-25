<script setup lang="ts">
	import { ref } from 'vue'
	import { mdiCloseCircleOutline } from '@mdi/js'

	export interface BhSnackbarErrorProps {
		text: string
	}

	defineProps<BhSnackbarErrorProps>()
	const opened = ref<boolean>(false)

	function open() {
		opened.value = true
	}

	function close() {
		opened.value = false
		emit('close')
	}

	defineExpose({
		open,
	})

	const emit = defineEmits(['close'])
</script>

<template>
	<v-snackbar
		location="center"
		:close-on-back="false"
		timeout="-1"
		rounded
		multi-line
		v-model="opened"
		color="error">
		<template v-slot:text>
			{{ text }}
		</template>
		<template v-slot:actions>
			<v-btn
				color="white"
				size="24"
				:icon="mdiCloseCircleOutline"
				@click.stop="close" />
		</template>
	</v-snackbar>
</template>
