import { ref } from 'vue'
import { io } from 'socket.io-client'
import { EnvConfig } from '../../config/env'
import { type IConversation, type IConversationMessage } from '@bookhood/shared'

interface ISocketState {
	connected: boolean

	conversation: IConversation
}

export const state = ref<ISocketState>({
	connected: false,
	conversation: null,
})

export const socket = io(EnvConfig.socket.url)

socket.on('connect', () => {
	state.value.connected = true
})

socket.on('disconnect', () => {
	state.value.connected = false
})

socket.on('conversation', (res: { data: IConversation }) => {
	state.value.conversation = res.data
})

socket.on('conversation-message', (res: { data: IConversationMessage }) => {
	state.value.conversation.messages.push(res.data)
})

export const emitEvent = (event: string, args: any) => {
	socket.emit(event, {
		token: localStorage.getItem('user'),
		...args,
	})
}
