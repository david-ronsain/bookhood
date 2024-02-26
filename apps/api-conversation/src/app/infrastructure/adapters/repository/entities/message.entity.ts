import { IConversationMessage } from '@bookhood/shared'
import { Document } from 'mongoose'

export interface ConversationMessageEntity
	extends Document,
		IConversationMessage {
	readonly _id: string

	readonly message: string

	readonly from: string

	readonly createdAt: string

	readonly updatedAt: string
}
