import { ref } from 'vue'
import { io } from 'socket.io-client'
import { EnvConfig } from '../../config/env'
import type {
	IConversation,
	IConversationMessage,
	FlagAsSeenMessageDTO,
	WritingDTO,
} from '@bookhood/shared'

interface ISocketState {
	connected: boolean

	conversation: IConversation

	writing: WritingDTO[]
}

export function useSocket() {
	const state = ref<ISocketState>({
		connected: false,
		conversation: null,
		writing: [],
	})

	const socket = io(EnvConfig.socket.url, {
		extraHeaders: {
			'x-token': localStorage.getItem('user'),
		},
	})

	socket.on('connect', () => {
		state.value.connected = true
	})

	socket.on('disconnect', () => {
		state.value.connected = false
	})

	socket.on('conversation', (res: { data: IConversation }) => {
		state.value.conversation = res.data
	})

	socket.on('conversation-writing', (res: WritingDTO) => {
		if (
			!state.value.writing
				.map((user: WritingDTO) => user.userId)
				.includes(res.userId)
		) {
			state.value.writing.push(res)
		}
	})

	socket.on('conversation-not-writing', (res: WritingDTO) => {
		state.value.writing = state.value.writing.filter(
			(user: WritingDTO) => user.userId !== res.userId,
		)
	})

	socket.on('conversation-message', (res: { data: IConversationMessage }) => {
		state.value.conversation.messages.push(res.data)
	})

	socket.on('conversation-flag-seen', (res: FlagAsSeenMessageDTO) => {
		const index = state.value.conversation.messages.findIndex(
			(message: IConversationMessage) => message._id === res.messageId,
		)
		if (index) {
			if (
				!Array.isArray(state.value.conversation.messages[index].seenBy)
			) {
				state.value.conversation.messages[index].seenBy = []
			}
			state.value.conversation.messages[index].seenBy.push(res.userId)
		}
	})

	const emitEvent = (event: string, args: any) => {
		socket.emit(event, {
			token: localStorage.getItem('user'),
			...args,
		})
	}

	return { socket, state, emitEvent }
}
