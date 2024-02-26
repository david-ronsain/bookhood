import { ClientProxy } from '@nestjs/microservices'
import GetOrCreateUseCase from '../../../../src/app/application/usecases/getOrCreate.usecase'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'
import { of } from 'rxjs'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import { IRequestInfos } from '../../../../../shared/src'
import { HttpStatus } from '@nestjs/common'

describe('AddMessageUseCase', () => {
	let getOrCreateUseCase: GetOrCreateUseCase
	let conversationRepository: ConversationRepository
	let bookClient: ClientProxy

	beforeEach(() => {
		conversationRepository = {
			getByRequestId: jest.fn(),
			create: jest.fn(),
		} as unknown as ConversationRepository

		bookClient = {
			send: jest.fn(() => of({})),
		} as unknown as ClientProxy

		getOrCreateUseCase = new GetOrCreateUseCase(
			conversationRepository,
			bookClient,
		)
	})

	describe('Testing the handler method', () => {
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

		it('should return the existing conversation', () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockImplementationOnce(() => Promise.resolve(conversation))

			expect(
				getOrCreateUseCase.handler(request._id, request.emitter._id),
			).resolves.toMatchObject(conversation)
		})

		it('should create a new conversation', () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockImplementationOnce(() => Promise.resolve(null))

			const req = new MicroserviceResponseFormatter<IRequestInfos>(
				true,
				HttpStatus.OK,
				{},
				request,
			)
			jest.spyOn(bookClient, 'send').mockImplementationOnce(() => of(req))

			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockImplementationOnce(() => Promise.resolve(conversation))

			expect(
				getOrCreateUseCase.handler(request._id, request.emitter._id),
			).resolves.toMatchObject(conversation)
		})
	})
})
