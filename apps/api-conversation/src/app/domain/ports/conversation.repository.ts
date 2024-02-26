import { IConversationFull, IConversationMessage } from '@bookhood/shared'
import ConversationModel from '../models/conversation.model'
import ConversationMessageModel from '../models/message.model'

export interface ConversationRepository {
	flagAsSeen(
		conversationId: string,
		messageId: string,
		userId: string,
	): Promise<boolean>

	getMessageById(
		conversationId: string,
		messageId: string,
	): Promise<ConversationMessageModel | null>

	roomIdExists(roomId: string): Promise<boolean>

	getByRequestId(requestId: string): Promise<IConversationFull | null>

	create(conversation: ConversationModel): Promise<ConversationModel>

	getById(id: string): Promise<ConversationModel | null>

	addMessage(
		id: string,
		message: ConversationMessageModel,
	): Promise<IConversationMessage>
}
