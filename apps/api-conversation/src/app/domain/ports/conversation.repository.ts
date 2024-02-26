import { IConversationFull, IConversationMessage } from '@bookhood/shared'
import ConversationModel from '../models/conversation.model'
import ConversationMessageModel from '../models/message.model'

export interface ConversationRepository {
	getByRequestId(requestId: string): Promise<IConversationFull | null>

	create(conversation: ConversationModel): Promise<ConversationModel>

	getById(id: string): Promise<ConversationModel | null>

	addMessage(
		id: string,
		message: ConversationMessageModel,
	): Promise<IConversationMessage>
}
