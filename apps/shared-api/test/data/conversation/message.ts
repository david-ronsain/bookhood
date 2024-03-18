/* eslint-disable @nx/enforce-module-boundaries */
import {
	AddMessageDTO,
	FlagAsSeenMessageDTO,
	IConversationMessage,
} from '../../../../shared/src'

export const addMessageDTO: AddMessageDTO = {
	token: 'token',
	_id: 'convId',
	message: 'Message',
	roomId: 'roomId',
	userId: 'userId',
	requestId: 'reqId',
}

export const flagAsSeenDTO: FlagAsSeenMessageDTO = {
	token: 'token',
	messageId: 'msgId',
	userId: 'userId',
	conversationId: 'convId',
}

export const message: IConversationMessage = {
	_id: 'msgId',
	from: 'userId',
	message: 'message',
	seenBy: [],
}
