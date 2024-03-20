/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { ClientProxy } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { ConversationController } from '../../../../src/app/application/controllers/conversation.controller'
import GetOrCreateUseCase from '../../../../src/app/application/usecases/getOrCreate.usecase'
import AddMessageUseCase from '../../../../src/app/application/usecases/addMessage.usecase'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import {
	HealthCheckStatus,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src'
import { Observable, of } from 'rxjs'
import { IConversationMessage } from '../../../../../shared/src'
import FlagAsSeenUseCase from '../../../../src/app/application/usecases/flagAsSeen.usecase'
import {
	addMessageDTO,
	conversationFull as conv,
	currentUser,
	flagAsSeenDTO,
	getOrCreateDTO,
} from '../../../../../shared-api/test'

describe('ConversationController', () => {
	let userClient: ClientProxy
	let getOrCreateUseCase: GetOrCreateUseCase
	let addMessageUseCase: AddMessageUseCase
	let flagAsSeenUseCase: FlagAsSeenUseCase
	let controller: ConversationController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ConversationController],
			providers: [
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
				{
					provide: GetOrCreateUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: AddMessageUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: FlagAsSeenUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
			],
		}).compile()
		controller = module.get<ConversationController>(ConversationController)
		userClient = module.get<ClientProxy>('RabbitUser')
		getOrCreateUseCase = module.get<GetOrCreateUseCase>(GetOrCreateUseCase)
		flagAsSeenUseCase = module.get<FlagAsSeenUseCase>(FlagAsSeenUseCase)
		addMessageUseCase = module.get<AddMessageUseCase>(AddMessageUseCase)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('health', () => {
		it('should return "up"', () => {
			const result = controller.health()
			expect(result).toBe(HealthCheckStatus.UP)
		})
	})

	describe('getOrCreateConversation', () => {
		it('should return a conversation after creating if it did not exist', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					{},
					currentUser,
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const conversation = { ...conv }
			conversation.request._id = getOrCreateDTO.requestId

			jest.spyOn(getOrCreateUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(conversation),
			)
			const result =
				await controller.getOrCreateConversation(getOrCreateDTO)

			expect(result.data).toMatchObject(conversation)
		})

		it('should fail if the user token is incorrect', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					HttpStatus.FORBIDDEN,
					{},
					currentUser,
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const result =
				await controller.getOrCreateConversation(getOrCreateDTO)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					getOrCreateDTO,
				),
			)
		})
	})

	describe('addMessage', () => {
		it('should return a conversation after creating if it did not exist', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					{},
					currentUser,
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)
			const message: IConversationMessage = {
				_id: 'id',
				from: addMessageDTO.userId,
				message: addMessageDTO.message,
				seenBy: [],
			}

			jest.spyOn(addMessageUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(message),
			)
			const result = await controller.addMessage(addMessageDTO)

			expect(result.data).toMatchObject(message)
		})

		it('should fail if the user token is incorrect', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					HttpStatus.FORBIDDEN,
					{},
					currentUser,
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const result = await controller.addMessage(addMessageDTO)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					addMessageDTO,
				),
			)
		})
	})

	describe('flagAsSeen', () => {
		it('should flag the message as seen', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					{},
					currentUser,
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			jest.spyOn(flagAsSeenUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(true),
			)
			const result = await controller.flagAsSeen(flagAsSeenDTO)

			expect(result.data).toBe(true)
		})

		it('should fail if the user token is incorrect', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					HttpStatus.FORBIDDEN,
					{},
					currentUser,
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const result = await controller.flagAsSeen(flagAsSeenDTO)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					flagAsSeenDTO,
				),
			)
		})
	})
})
