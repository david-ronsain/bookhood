import { IConversation } from '@bookhood/shared'
import ConversationMessageModel from './message.model'

export default class ConversationModel {
	constructor(conversation?: IConversation) {
		if (conversation) {
			this._id = conversation._id?.toString()
			this.requestId = conversation.requestId
			this.roomId = conversation.roomId
			this.users = conversation.users
			this.messages = conversation.messages
		}
	}

	readonly _id?: string

	readonly requestId: string

	readonly roomId: string

	readonly users: string[]

	readonly messages: ConversationMessageModel[]
}
