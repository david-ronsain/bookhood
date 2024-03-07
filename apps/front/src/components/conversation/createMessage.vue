<script setup lang="ts">
	import { BhTextField } from '@bookhood/ui'
	import { mdiLoading, mdiSendOutline } from '@mdi/js'
	import { computed, ref, onMounted, watch } from 'vue'
	import { Fragment } from 'vue/jsx-runtime'
	import type { WritingDTO, IConversationMessage } from '@bookhood/shared'
	import { state, emitEvent, socket } from '../../composables/socket'
	import { useMainStore } from '../../store'
	import { useI18n } from 'vue-i18n'

	interface CreateMessageProps {
		conversationId: string

		roomId: string

		requestId?: string
	}

	const mainStore = useMainStore()
	const { t } = useI18n({})
	const props = defineProps<CreateMessageProps>()

	const loading = ref<boolean>(false)
	const currentMessage = ref<string>('')

	const writing = computed<WritingDTO>(() => state.value.writing)
	const icon = computed(() => (loading.value ? mdiLoading : mdiSendOutline))
	const iconDisabled = computed(
		() => loading.value || currentMessage.value.length === 0,
	)
	const me = computed(() => mainStore.profile)

	const send = (): void => {
		if (currentMessage.value) {
			loading.value = true
			emitEvent('conversation-add-message', {
				message: currentMessage.value,
				_id: props.conversationId,
				userId: me.value._id,
				roomId: props.roomId,
				requestId: props.requestId,
			})
		}
	}

	onMounted(() => {
		socket.on(
			'conversation-message',
			(res: { data: IConversationMessage }) => {
				if (res.data.from === me.value._id) {
					loading.value = false
					currentMessage.value = ''
				}
			},
		)

		socket.on('conversation-add-message-error', () => {
			mainStore.error = t('conversation.error.messageCanNotBeCreated')
		})

		socket.on('conversation-access-forbidden', () => {
			mainStore.error = t('conversation.error.accessForbidden')
		})
	})

	watch(currentMessage, () => {
		if (currentMessage.value.length) {
			emitEvent('conversation-writing', {
				firstName: me.value.firstName,
				roomId: props.conversationId,
				userId: me.value._id,
			})
		} else {
			emitEvent('conversation-not-writing', {
				roomId: props.roomId,
				userId: me.value._id,
			})
		}
	})
</script>

<template>
	<div>
		<div
			class="is-writing"
			v-if="writing.length"
			v-text="
				$t(
					'conversation.isWriting',
					{
						names: writing
							.map((user: WritingDTO) => user.firstName)
							.join(', '),
					},
					writing.length,
				)
			" />
		<bh-text-field
			autofocus
			clear
			density="compact"
			:icon="{
				appendInner: true,
				icon,
				disabled: iconDisabled,
			}"
			:placeholder="$t('conversation.writemessage')"
			rounded
			variant="outlined"
			v-model="currentMessage"
			@keyup.enter.prevent="send"
			@click:appendInner="send" />
	</div>
</template>
