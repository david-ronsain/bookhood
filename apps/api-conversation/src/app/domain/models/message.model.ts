import { IConversationMessage } from '@bookhood/shared'

export default class ConversationMessageModel {
	constructor(message?: IConversationMessage) {
		if (message) {
			this._id = message._id?.toString()
			this.message = message.message
			this.from = message.from
			this.seenBy = message.seenBy
		}
	}

	readonly _id?: string

	readonly message: string

	readonly from: string

	readonly seenBy: string[]
}
