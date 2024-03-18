import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { ConversationRepository } from '../../domain/ports/conversation.repository'
import { AddMessageDTO, IConversationMessage } from '@bookhood/shared'
import ConversationMessageModel from '../../domain/models/message.model'

export default class AddMessageUseCase {
	constructor(
		@Inject('ConversationRepository')
		private readonly conversationRepository: ConversationRepository,
	) {}

	async handler(dto: AddMessageDTO): Promise<IConversationMessage> {
		const conversation = await this.conversationRepository.getByRequestId(
			dto._id,
			dto.requestId,
		)

		if (!conversation) {
			throw new NotFoundException('This conversation does not exist')
		} else if (
			![
				conversation.request.emitter._id.toString(),
				conversation.request.owner._id.toString(),
			].includes(dto.userId)
		) {
			throw new ForbiddenException(
				"You don't have access to this conversation",
			)
		}

		const message = new ConversationMessageModel({
			message: dto.message.trim(),
			from: dto.userId,
			seenBy: [],
		})

		return await this.conversationRepository.addMessage(dto._id, message)
	}
}
