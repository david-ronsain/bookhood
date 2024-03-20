<script setup lang="ts">
	import { ref } from 'vue'
	import { watch } from 'vue'
	import BhCard from '../../cards/card/bhCard.vue'

	export interface IBhDialogProps {
		opened?: boolean
		title?: string
		fullscreen?: boolean
	}

	const props = withDefaults(defineProps<IBhDialogProps>(), {
		opened: false,
		fullscreen: false,
	})
	const isOpened = ref(props.opened)
	watch(props, (value: IBhDialogProps) => {
		isOpened.value = !!value.opened
	})

	function open() {
		isOpened.value = true
	}

	function close() {
		isOpened.value = false
	}

	defineExpose({
		open,
		close,
	})
</script>

<template>
	<v-dialog
		:max-width="fullscreen ? '' : 600"
		:modelValue="isOpened"
		:fullscreen="fullscreen"
		persistent>
		<bh-card
			:hover="false"
			:title="title">
			<template v-slot:text>
				<slot name="default"></slot>
			</template>

			<template v-slot:actions>
				<v-card-actions class="px-6 justify-space-between">
					<slot name="actions"></slot>
				</v-card-actions>
			</template>
		</bh-card>
	</v-dialog>
</template>

<style scoped></style>
