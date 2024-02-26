import ConversationModel from '../../domain/models/conversation.model'
import { ConversationEntity } from '../../infrastructure/adapters/repository/entities/conversation.entity'

export default class ConversationMapper {
	public static fromEntitytoModel(
		conversationEntity: ConversationEntity,
	): ConversationModel {
		return new ConversationModel(conversationEntity)
	}
}
