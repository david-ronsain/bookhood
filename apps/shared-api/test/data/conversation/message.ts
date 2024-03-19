/* eslint-disable @nx/enforce-module-boundaries */
import {
	AddMessageDTO,
	FlagAsSeenMessageDTO,
	GetOrCreateConversationDTO,
	IConversationMessage,
	Locale,
} from '../../../../shared/src'

export const addMessageDTO: AddMessageDTO = {
	_id: 'convId',
	message: 'Message',
	roomId: 'roomId',
	userId: 'userId',
	requestId: 'reqId',
	session: {
		token: 'token',
		locale: Locale.FR,
	},
}

export const flagAsSeenDTO: FlagAsSeenMessageDTO = {
	messageId: 'msgId',
	userId: 'userId',
	conversationId: 'convId',
	session: {
		token: 'token',
		locale: Locale.FR,
	},
}

export const getOrCreateDTO: GetOrCreateConversationDTO = {
	requestId: 'requestId',
	session: {
		token: 'token',
		locale: Locale.FR,
	},
}

export const message: IConversationMessage = {
	_id: 'msgId',
	from: 'userId',
	message: 'message',
	seenBy: [],
}
