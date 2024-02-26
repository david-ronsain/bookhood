import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { ConversationRepository } from '../../domain/ports/conversation.repository'
import ConversationModel from '../../domain/models/conversation.model'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import {
	AddMessageDTO,
	IConversationFull,
	IConversationMessage,
	IRequestInfos,
} from '@bookhood/shared'
import { v4 } from 'uuid'
import ConversationMessageModel from '../../domain/models/message.model'

export default class AddMessageUseCase {
	constructor(
		@Inject('ConversationRepository')
		private readonly conversationRepository: ConversationRepository,
	) {}

	async handler(dto: AddMessageDTO): Promise<IConversationMessage> {
		const conversation = await this.conversationRepository.getByRequestId(
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
		})

		return await this.conversationRepository.addMessage(dto._id, message)
	}
}
