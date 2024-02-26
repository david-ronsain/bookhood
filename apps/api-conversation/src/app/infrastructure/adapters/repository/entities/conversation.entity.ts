import { IConversation } from '@bookhood/shared'
import { Document } from 'mongoose'
import { ConversationMessageEntity } from './message.entity'

export interface ConversationEntity extends Document, IConversation {
	readonly _id: string

	readonly requestId: string

	readonly roomId: string

	readonly users: string[]

	readonly messages: ConversationMessageEntity[]

	readonly createdAt: string

	readonly updatedAt: string
}
