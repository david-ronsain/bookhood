<script setup lang="ts">
	import { BhCard } from '@bookhood/ui'
	import { mdiCheckBold } from '@mdi/js'
	import type { IConversationMessage } from '@bookhood/shared'
	import { computed } from 'vue'
	import { useMainStore } from '../../store'
	import { emitEvent } from '../../composables/socket.composable'
	import {
		WSConversationEventType,
		type IConversationFull,
	} from '@bookhood/shared'

	interface MessageProps {
		message: IConversationMessage
		conversation: IConversationFull | null
	}

	const mainStore = useMainStore()
	const props = defineProps<MessageProps>()

	const me = computed(() => mainStore.profile)

	const seen = (message: IConversationMessage): boolean =>
		message.from === me.value._id &&
		Array.isArray(message.seenBy) &&
		message.seenBy.length

	const flagAsSeen = (
		isIntersecting,
		entries,
		observer,
		message: IConversationMessage,
	): void => {
		if (
			isIntersecting &&
			entries[0].intersectionRatio === 1 &&
			message.from !== me.value._id &&
			!message.seenBy?.includes(me.value._id)
		) {
			emitEvent(WSConversationEventType.FLAG_MESSAGE_SEEN, {
				messageId: message._id,
				conversationId: props.conversation?._id,
				userId: me.value._id,
			})
		}
	}
</script>

<template>
	<bh-card
		v-if="me"
		border
		flat
		:hover="false"
		class="my-1"
		:class="
			message.from === me._id ? 'align-self-end' : 'align-self-start'
		">
		<template v-slot:text>
			<div
				v-text="message.message"
				v-intersect.once="{
					handler: (isIntersecting, entries, observer) =>
						flagAsSeen(isIntersecting, entries, observer, message),
					options: {
						threshold: [1],
					},
				}" />
			<v-icon
				v-if="seen(message)"
				size="12"
				color="green">
				{{ mdiCheckBold }}
			</v-icon>
		</template>
	</bh-card>
</template>
