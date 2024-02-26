<script setup lang="ts">
	import { onMounted, onUnmounted, watch, computed } from 'vue'
	import { socket, state, emitEvent } from '../composables/socket'
	import { useRoute } from 'vue-router'
	import { useMainStore } from '../store'
	import type {
		IConversationFull,
		IUser,
		IConversationMessage,
	} from '@bookhood/shared'
	import { BhCard, BhTextField } from '@bookhood/ui'
	import { mdiLoading, mdiSendOutline } from '@mdi/js'
	import { ref } from 'vue'

	const route = useRoute()
	const mainStore = useMainStore()

	const socketConnected = computed(() => state.value.connected)
	const conversation = computed<IConversationFull>(
		() => state.value.conversation,
	)
	const me = computed(() => mainStore.profile)
	const other = computed<IUser>(() =>
		me.value && conversation
			? conversation.value?.request?.emitter?._id !== me.value._id
				? conversation.value?.request?.emitter
				: conversation.value?.request?.owner
			: null,
	)
	const iconDisabled = computed(
		() => loading.value || currentMessage.value.length === 0,
	)
	const icon = computed(() => (loading.value ? mdiLoading : mdiSendOutline))
	const currentMessage = ref<string>('')
	const loading = ref<boolean>(false)

	const send = (): void => {
		if (currentMessage.value) {
			loading.value = true
			emitEvent('conversation-add-message', {
				message: currentMessage.value,
				_id: conversation.value._id,
				userId: me.value._id,
				roomId: conversation.value.roomId,
			})
		}
	}

	onMounted(() => {
		socket.connect()

		socket.on(
			'conversation-message',
			(res: { data: IConversationMessage }) => {
				if (res.data.from === me.value._id) {
					loading.value = false
					currentMessage.value = ''
				}
			},
		)
	})

	onUnmounted(() => {
		socket.disconnect()
	})

	watch(socketConnected, () => {
		if (socketConnected.value) {
			emitEvent('conversation-connect', { requestId: route.params.id })
		}
	})
	watch(currentMessage, () => {})
</script>

<template>
	<v-container
		:class="route.meta.fullHeight ? 'fullheight' : ''"
		fluid
		id="conversation">
		<bh-card
			v-if="conversation"
			height="100%"
			flat
			:title="`Conversation avec ${other.firstName} ${other.lastName} à propos de ${conversation?.request?.book?.title}`">
			<template v-slot:text>
				<div class="d-flex flex-column">
					<bh-card
						border
						v-for="message in conversation.messages"
						flat
						:hover="false"
						:key="message._id"
						class="my-1"
						:class="
							message.from === me._id
								? 'align-self-end'
								: 'align-self-start'
						">
						<template v-slot:text>
							{{ message.message }}
						</template>
					</bh-card>
				</div>
			</template>

			<template v-slot:actions>
				<bh-text-field
					autofocus
					clear
					:icon="{
						appendInner: true,
						icon,
						disabled: iconDisabled,
					}"
					placeholder="Write your message"
					rounded
					variant="outlined"
					v-model="currentMessage"
					@keyup.enter.prevent="send"
					@click:appendInner="send" />
			</template>
		</bh-card>
	</v-container>
</template>

<style lang="scss" scoped>
	.v-container.fullheight {
		height: 100%;
	}
</style>
