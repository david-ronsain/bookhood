/* eslint-disable @nx/enforce-module-boundaries */
import { IConversation, IConversationFull } from '../../../../shared/src'

export const conversationFull: IConversationFull = {
	_id: 'convId',
	messages: [],
	request: {
		_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
		book: {
			title: 'title',
		},
		createdAt: '',
		emitter: {
			_id: 'id#1',
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@email.test',
		},
		owner: {
			_id: 'id#2',
			firstName: 'first1',
			lastName: 'last1',
			email: 'first1.last1@email.test',
		},
	},
	roomId: 'roomId',
}

export const conversation: IConversation = {
	_id: 'convId',
	messages: [],
	requestId: 'requestId',
	roomId: 'roomId',
	users: ['userId1', 'userId2'],
}

export const conversationRepository = {
	getByRequestId: jest.fn(),
	addMessage: jest.fn(),
	flagAsSeen: jest.fn(),
	create: jest.fn(),
	roomIdExists: jest.fn(),
	getMessageById: jest.fn(),
}
