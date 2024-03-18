/* eslint-disable @nx/enforce-module-boundaries */
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { IConversationMessage } from '../../../../../shared/src'
import AddMessageUseCase from '../../../../src/app/application/usecases/addMessage.usecase'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'
import {
	addMessageDTO,
	conversationRepository as convRepo,
	conversationFull,
	message as msg,
} from '../../../../../shared-api/test'

describe('AddMessageUseCase', () => {
	let addMessageUseCase: AddMessageUseCase
	let conversationRepository: ConversationRepository

	beforeEach(() => {
		conversationRepository = {
			...convRepo,
		} as unknown as ConversationRepository

		addMessageUseCase = new AddMessageUseCase(conversationRepository)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('Testing the handler method', () => {
		it('should throw an error because the conversation does not exist', () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockReturnValueOnce(Promise.resolve(null))

			expect(addMessageUseCase.handler(addMessageDTO)).rejects.toThrow(
				NotFoundException,
			)
		})

		it('should not add the message to the conversation because the user is not in the conv', async () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockReturnValueOnce(Promise.resolve(conversationFull))
			jest.spyOn(conversationRepository, 'addMessage')

			expect(addMessageUseCase.handler(addMessageDTO)).rejects.toThrow(
				ForbiddenException,
			)
			expect(conversationRepository.addMessage).not.toHaveBeenCalled()
		})

		it('should add the message to the conversation', async () => {
			const dto = {
				...addMessageDTO,
				userId: conversationFull.request.emitter._id,
			}
			const message: IConversationMessage = {
				...msg,
				from: dto.userId ?? '',
				message: dto.message,
			}

			jest.spyOn(
				conversationRepository,
				'addMessage',
			).mockReturnValueOnce(Promise.resolve(message))
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockReturnValueOnce(Promise.resolve(conversationFull))

			const res = await addMessageUseCase.handler(dto)
			expect(res).toMatchObject(message)
		})
	})
})
