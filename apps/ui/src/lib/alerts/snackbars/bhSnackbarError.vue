<script setup lang="ts">
	import { ref } from 'vue'
	import { mdiCloseCircleOutline } from '@mdi/js'
	import { watch } from 'vue'

	export interface BhSnackbarErrorProps {
		text?: string
		opened?: boolean
	}

	const props = withDefaults(defineProps<BhSnackbarErrorProps>(), {
		text: '',
		opened: false,
	})
	const isOpened = ref(props.opened)

	function open() {
		isOpened.value = true
	}

	function close() {
		isOpened.value = false
		emit('close')
	}

	watch(props, (p: BhSnackbarErrorProps) => {
		isOpened.value = p.opened || false
	})

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
		v-model="isOpened"
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
