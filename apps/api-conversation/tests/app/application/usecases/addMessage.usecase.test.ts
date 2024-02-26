import { NotFoundException } from '@nestjs/common'
import { AddMessageDTO, IConversationMessage } from '../../../../../shared/src'
import AddMessageUseCase from '../../../../src/app/application/usecases/addMessage.usecase'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'

describe('AddMessageUseCase', () => {
	let addMessageUseCase: AddMessageUseCase
	let conversationRepository: ConversationRepository

	beforeEach(() => {
		conversationRepository = {
			getById: jest.fn(),
			addMessage: jest.fn(),
		} as unknown as ConversationRepository

		addMessageUseCase = new AddMessageUseCase(conversationRepository)
	})

	describe('Testing the handler method', () => {
		const dto: AddMessageDTO = {
			_id: 'convId',
			message: 'message',
			roomId: 'roomId',
			token: 'token',
			userId: 'userId',
		}

		it('should throw an error because the conversation does not exist', () => {
			jest.spyOn(conversationRepository, 'getById').mockReturnValueOnce(
				Promise.resolve(null),
			)

			expect(addMessageUseCase.handler(dto)).rejects.toThrow(
				NotFoundException,
			)
		})

		it('should add the message to the conversation', async () => {
			jest.spyOn(conversationRepository, 'getById').mockReturnValueOnce(
				Promise.resolve({
					_id: dto._id,
					messages: [],
					requestId: 'reqId',
					roomId: dto.roomId,
					users: [dto.userId, 'userId1'],
				}),
			)
			const message: IConversationMessage = {
				from: dto.userId,
				message: dto.message,
				_id: 'msgId',
			}
			jest.spyOn(
				conversationRepository,
				'addMessage',
			).mockReturnValueOnce(Promise.resolve(message))

			expect(addMessageUseCase.handler(dto)).resolves.toMatchObject(
				message,
			)
		})
	})
})
