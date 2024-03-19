import { Inject, NotFoundException } from '@nestjs/common'
import { ConversationRepository } from '../../domain/ports/conversation.repository'
import { FlagAsSeenMessageDTO } from '@bookhood/shared'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class FlagAsSeenUseCase {
	constructor(
		@Inject('ConversationRepository')
		private readonly conversationRepository: ConversationRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(dto: FlagAsSeenMessageDTO): Promise<boolean> {
		const message = await this.conversationRepository.getMessageById(
			dto.conversationId,
			dto.messageId,
		)
		if (!message) {
			throw new NotFoundException(
				this.i18n.t('errors.flagAsSeen.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
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
