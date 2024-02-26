import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { ConversationRepository } from '../../domain/ports/conversation.repository'
import { FlagAsSeenMessageDTO, IConversationMessage } from '@bookhood/shared'
import ConversationMessageModel from '../../domain/models/message.model'

export default class FlagAsSeenUseCase {
	constructor(
		@Inject('ConversationRepository')
		private readonly conversationRepository: ConversationRepository,
	) {}

	async handler(dto: FlagAsSeenMessageDTO): Promise<boolean> {
		const message = await this.conversationRepository.getMessageById(
			dto.conversationId,
			dto.messageId,
		)
		if (!message) {
			throw new NotFoundException('This message does not exist')
		} else if (message.from !== dto.userId) {
			await this.conversationRepository.flagAsSeen(
				dto.conversationId,
				dto.messageId,
				dto.userId,
			)
		}

		return true
	}
}
