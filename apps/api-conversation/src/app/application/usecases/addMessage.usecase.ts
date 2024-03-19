import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { ConversationRepository } from '../../domain/ports/conversation.repository'
import { AddMessageDTO, IConversationMessage } from '@bookhood/shared'
import ConversationMessageModel from '../../domain/models/message.model'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class AddMessageUseCase {
	constructor(
		@Inject('ConversationRepository')
		private readonly conversationRepository: ConversationRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(dto: AddMessageDTO): Promise<IConversationMessage> {
		const conversation = await this.conversationRepository.getByRequestId(
			dto._id,
			dto.requestId,
		)

		if (!conversation) {
			throw new NotFoundException(
				this.i18n.t('errors.addMessage.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		} else if (
			![
				conversation.request.emitter._id.toString(),
				conversation.request.owner._id.toString(),
			].includes(dto.userId)
		) {
			throw new ForbiddenException(
				this.i18n.t('errors.addMessage.forbidden', {
					lang: I18nContext.current()?.lang,
				}),
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
