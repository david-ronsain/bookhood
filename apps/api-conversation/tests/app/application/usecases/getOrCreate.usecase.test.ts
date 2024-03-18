/* eslint-disable @nx/enforce-module-boundaries */
import { ClientProxy } from '@nestjs/microservices'
import GetOrCreateUseCase from '../../../../src/app/application/usecases/getOrCreate.usecase'
import { ConversationRepository } from '../../../../src/app/domain/ports/conversation.repository'
import { of } from 'rxjs'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import { IRequestInfos } from '../../../../../shared/src'
import { HttpStatus } from '@nestjs/common'
import {
	conversationRepository as convRepo,
	conversationFull,
	requestInfos,
} from '../../../../../shared-api/test'

describe('AddMessageUseCase', () => {
	let getOrCreateUseCase: GetOrCreateUseCase
	let conversationRepository: ConversationRepository
	let bookClient: ClientProxy

	beforeEach(() => {
		conversationRepository = {
			...convRepo,
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
		it('should return the existing conversation', () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockImplementationOnce(() => Promise.resolve(conversationFull))

			expect(
				getOrCreateUseCase.handler(
					requestInfos._id,
					requestInfos.emitter._id || '',
				),
			).resolves.toMatchObject(conversationFull)
		})

		it('should create a new conversation', () => {
			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockImplementationOnce(() => Promise.resolve(null))

			jest.spyOn(
				conversationRepository,
				'roomIdExists',
			).mockImplementationOnce(() => Promise.resolve(false))

			const req = new MicroserviceResponseFormatter<IRequestInfos>(
				true,
				HttpStatus.OK,
				{},
				requestInfos,
			)
			jest.spyOn(bookClient, 'send').mockImplementationOnce(() => of(req))

			jest.spyOn(
				conversationRepository,
				'getByRequestId',
			).mockImplementationOnce(() => Promise.resolve(conversationFull))

			expect(
				getOrCreateUseCase.handler(
					requestInfos._id,
					requestInfos.emitter._id || '',
				),
			).resolves.toMatchObject(conversationFull)
		})
	})
})
