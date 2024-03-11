/* eslint-disable @nx/enforce-module-boundaries */
import { IConversationFull } from '../../../shared/src'

export const conversation: IConversationFull = {
	_id: 'convId',
	roomId: 'roomId',
	request: {
		_id: 'reqId',
		createdAt: new Date().toISOString(),
		book: {
			title: 'title',
		},
		emitter: {
			email: '1@email.test',
			firstName: 'first1',
			lastName: 'last1',
			_id: 'userId1',
		},
		owner: {
			email: '2@email.test',
			firstName: 'first2',
			lastName: 'last2',
			_id: 'userId2',
		},
	},
	messages: [
		{
			_id: 'msg1',
			from: 'userId1',
			message: 'message',
			seenBy: [],
		},
	],
}

export const message = {
	_id: 'msg1',
	from: 'userId1',
	message: 'message',
	seenBy: [],
}
