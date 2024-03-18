/* eslint-disable @nx/enforce-module-boundaries */
import { NotFoundException } from '@nestjs/common'
import { FlagAsSeenMessageDTO } from '../../../../../shared/src'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'
import FlagAsSeenUseCase from '../../../../src/app/application/usecases/flagAsSeen.usecase'
import { conversationRepository as convRepo } from '../../../../../shared-api/test'

describe('FlagAsSeenUseCase', () => {
	let flagAsSeenUseCase: FlagAsSeenUseCase
	let conversationRepository: ConversationRepository

	beforeEach(() => {
		conversationRepository = {
			...convRepo,
		} as unknown as ConversationRepository

		flagAsSeenUseCase = new FlagAsSeenUseCase(conversationRepository)
	})

	describe('Testing the handler method', () => {
		const dto: FlagAsSeenMessageDTO = {
			messageId: 'msgId',
			token: 'token',
			userId: 'id#1',
			conversationId: 'convId',
		}

		it('should throw an error because the conversation does not exist', () => {
			jest.spyOn(
				conversationRepository,
				'getMessageById',
			).mockReturnValueOnce(Promise.resolve(null))

			expect(flagAsSeenUseCase.handler(dto)).rejects.toThrow(
				NotFoundException,
			)
		})

		it('should flag the message as seen', async () => {
			jest.spyOn(
				conversationRepository,
				'getMessageById',
			).mockReturnValueOnce(
				Promise.resolve({
					_id: dto.messageId,
					message: 'message',
					from: 'userId1',
					seenBy: [],
				}),
			)
			jest.spyOn(
				conversationRepository,
				'flagAsSeen',
			).mockReturnValueOnce(Promise.resolve(true))

			expect(flagAsSeenUseCase.handler(dto)).resolves.toBe(true)
		})
	})
})
