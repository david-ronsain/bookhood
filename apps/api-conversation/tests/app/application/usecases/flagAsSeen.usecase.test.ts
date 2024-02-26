import { NotFoundException } from '@nestjs/common'
import {
	AddMessageDTO,
	FlagAsSeenMessageDTO,
	IConversationMessage,
} from '../../../../../shared/src'
import AddMessageUseCase from '../../../../src/app/application/usecases/addMessage.usecase'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'
import FlagAsSeenUseCase from '../../../../src/app/application/usecases/flagAsSeen.usecase'

describe('FlagAsSeenUseCase', () => {
	let flagAsSeenUseCase: FlagAsSeenUseCase
	let conversationRepository: ConversationRepository

	beforeEach(() => {
		conversationRepository = {
			getMessageById: jest.fn(),
			flagAsSeen: jest.fn(),
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
