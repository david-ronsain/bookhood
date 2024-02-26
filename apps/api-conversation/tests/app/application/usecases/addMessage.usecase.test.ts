import { NotFoundException } from '@nestjs/common'
import { AddMessageDTO, IConversationMessage } from '../../../../../shared/src'
import AddMessageUseCase from '../../../../src/app/application/usecases/addMessage.usecase'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'

describe('AddMessageUseCase', () => {
	let addMessageUseCase: AddMessageUseCase
	let conversationRepository: ConversationRepository

	beforeEach(() => {
		conversationRepository = {
			getByRequestId: jest.fn(),
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
			userId: 'id#1',
			requestId: 'reqId',
		}

		const request = {
			_id: 'reqId',
			book: {
				title: 'title',
			},
			createdAt: '',
			emitter: {
				_id: 'id#1',
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@email.test',
			},
			owner: {
				_id: 'id#2',
				firstName: 'first1',
				lastName: 'last1',
				email: 'first1.last1@email.test',
			},
		}
		const conversation = {
			_id: 'convId',
			messages: [],
			request,
			roomId: 'roomId',
		}

		it('should throw an error because the conversation does not exist', () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockReturnValueOnce(Promise.resolve(null))

			expect(addMessageUseCase.handler(dto)).rejects.toThrow(
				NotFoundException,
			)
		})

		it('should add the message to the conversation', async () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockReturnValueOnce(Promise.resolve(conversation))
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
