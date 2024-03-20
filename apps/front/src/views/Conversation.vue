<script setup lang="ts">
	import { onMounted, onUnmounted, watch, computed } from 'vue'
	import { emitEvent, socket, state } from '../composables/socket.composable'
	import { useRoute } from 'vue-router'
	import type { IConversationFull } from '@bookhood/shared'
	import { WSConversationEventType } from '@bookhood/shared'

	const route = useRoute()

	const socketConnected = computed(() => state.value.connected)
	const conversation = computed<IConversationFull>(
		() => state.value.conversation,
	)

	onMounted(() => {
		socket.connect()

		if (socketConnected.value) {
			emitEvent(WSConversationEventType.CONNECT, {
				requestId: route.params.id,
			})
		}
	})

	onUnmounted(() => {
		socket.disconnect()
	})

	watch(socketConnected, () => {
		if (socketConnected.value) {
			emitEvent(WSConversationEventType.CONNECT, {
				requestId: route.params.id,
			})
		}
	})
</script>

<template>
	<v-container
		class="d-flex justify-center"
		:class="
			(route.meta.fullHeight ? 'fullheight' : '') +
			' ' +
			(conversation ? '' : 'align-center')
		"
		fluid>
		<conversation
			v-if="conversation"
			:conversation="conversation"></conversation>

		<v-progress-circular
			v-else
			color="primary"
			indeterminate
			:size="100" />
	</v-container>
</template>

<style lang="scss" scoped>
	.v-container.fullheight {
		max-height: 100%;
	}
</style>
../composables/socket.composable
