/* eslint-disable @nx/enforce-module-boundaries */
import { NotFoundException } from '@nestjs/common'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'
import FlagAsSeenUseCase from '../../../../src/app/application/usecases/flagAsSeen.usecase'
import {
	conversationRepository as convRepo,
	flagAsSeenDTO,
} from '../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('FlagAsSeenUseCase', () => {
	let flagAsSeenUseCase: FlagAsSeenUseCase
	let conversationRepository: ConversationRepository
	let i18n: I18nService

	beforeEach(() => {
		conversationRepository = {
			...convRepo,
		} as unknown as ConversationRepository
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		flagAsSeenUseCase = new FlagAsSeenUseCase(conversationRepository, i18n)
	})

	describe('Testing the handler method', () => {
		it('should throw an error because the conversation does not exist', () => {
			jest.spyOn(
				conversationRepository,
				'getMessageById',
			).mockReturnValueOnce(Promise.resolve(null))

			expect(flagAsSeenUseCase.handler(flagAsSeenDTO)).rejects.toThrow(
				NotFoundException,
			)
		})

		it('should flag the message as seen', async () => {
			jest.spyOn(
				conversationRepository,
				'getMessageById',
			).mockReturnValueOnce(
				Promise.resolve({
					_id: flagAsSeenDTO.messageId,
					message: 'message',
					from: 'userId1',
					seenBy: [],
				}),
			)
			jest.spyOn(
				conversationRepository,
				'flagAsSeen',
			).mockReturnValueOnce(Promise.resolve(true))

			expect(flagAsSeenUseCase.handler(flagAsSeenDTO)).resolves.toBe(true)
		})
	})
})
