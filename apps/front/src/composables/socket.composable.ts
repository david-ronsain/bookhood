import { ref } from 'vue'
import { io } from 'socket.io-client'
import { EnvConfig } from '../../config/env'
import type {
	IConversation,
	IConversationMessage,
	FlagAsSeenMessageDTO,
	WritingDTO,
} from '@bookhood/shared'
import { WSConversationEventType } from '@bookhood/shared'

interface ISocketState {
	connected: boolean

	conversation: IConversation

	writing: WritingDTO[]
}

export const state = ref<ISocketState>({
	connected: false,
	conversation: null,
	writing: [],
})

export const socket = io(EnvConfig.socket.url, {
	extraHeaders: {
		'x-token': localStorage.getItem(EnvConfig.localStorage.userKey),
	},
})

export const emitEvent = (event: string, args: any) => {
	socket.emit(event, {
		token: localStorage.getItem(EnvConfig.localStorage.userKey),
		...args,
	})
}

socket.on('connect', () => {
	state.value.connected = true
})

socket.on('disconnect', () => {
	state.value.connected = false
})

socket.on(
	WSConversationEventType.READ_SUCCESS,
	(res: { data: IConversation }) => {
		state.value.conversation = res.data
	},
)

socket.on(WSConversationEventType.IS_WRITING_SUCCESS, (res: WritingDTO) => {
	if (
		!state.value.writing
			.map((user: WritingDTO) => user.userId)
			.includes(res.userId)
	) {
		state.value.writing.push(res)
	}
})

socket.on(WSConversationEventType.NOT_WRITING_SUCCESS, (res: WritingDTO) => {
	state.value.writing = state.value.writing.filter(
		(user: WritingDTO) => user.userId !== res.userId,
	)
})

socket.on(
	WSConversationEventType.GET_MESSAGE,
	(res: { data: IConversationMessage }) => {
		state.value.conversation.messages.push(res.data)
	},
)

socket.on(
	WSConversationEventType.FLAG_MESSAGE_SEEN_SUCCESS,
	(res: FlagAsSeenMessageDTO) => {
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
	},
)
