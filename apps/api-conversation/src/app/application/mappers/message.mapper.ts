import ConversationMessageModel from '../../domain/models/message.model'
import { ConversationMessageEntity } from '../../infrastructure/adapters/repository/entities/message.entity'

export default class MessageMapper {
	public static fromEntitytoModel(
		messageEntity: ConversationMessageEntity,
	): ConversationMessageModel {
		return new ConversationMessageModel(messageEntity)
	}
}
