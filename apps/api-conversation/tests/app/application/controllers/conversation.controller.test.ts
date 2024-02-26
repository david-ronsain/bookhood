/* eslint-disable @nx/enforce-module-boundaries */
import { ClientProxy } from '@nestjs/microservices'
import { Test, TestingModule } from '@nestjs/testing'
import { ConversationController } from '../../../../src/app/application/controllers/conversation.controller'
import GetOrCreateUseCase from '../../../../src/app/application/usecases/getOrCreate.usecase'
import AddMessageUseCase from '../../../../src/app/application/usecases/addMessage.usecase'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import { Observable, of } from 'rxjs'
import {
	AddMessageDTO,
	FlagAsSeenMessageDTO,
	GetOrCreateConversationDTO,
	IConversationFull,
	IConversationMessage,
} from '../../../../../shared/src'
import FlagAsSeenUseCase from '../../../../src/app/application/usecases/flagAsSeen.usecase'

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
			expect(result).toBe('up')
		})
	})

	describe('getOrCreateConversation', () => {
		it('should return a conversation after creating if it did not exist', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const dto: GetOrCreateConversationDTO = {
				requestId: 'requestId',
				token: 'token',
			}
			const conversation: IConversationFull = {
				_id: 'convId',
				messages: [],
				request: {
					_id: dto.requestId,
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
				},
				roomId: 'roomId',
			}

			jest.spyOn(getOrCreateUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(conversation),
			)
			const result = await controller.getOrCreateConversation(dto)

			expect(result.data).toMatchObject(conversation)
		})

		it('should fail if the user token is incorrect', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					HttpStatus.FORBIDDEN,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const dto: GetOrCreateConversationDTO = {
				requestId: 'requestId',
				token: 'token',
			}
			const result = await controller.getOrCreateConversation(dto)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					dto,
				),
			)
		})
	})

	describe('addMessage', () => {
		const dto: AddMessageDTO = {
			token: 'token',
			_id: 'convId',
			message: 'Message',
			roomId: 'roomId',
			userId: 'userId',
			requestId: 'reqId',
		}

		it('should return a conversation after creating if it did not exist', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)
			const message: IConversationMessage = {
				_id: 'id',
				from: dto.userId,
				message: dto.message,
				seenBy: [],
			}

			jest.spyOn(addMessageUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(message),
			)
			const result = await controller.addMessage(dto)

			expect(result.data).toMatchObject(message)
		})

		it('should fail if the user token is incorrect', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					HttpStatus.FORBIDDEN,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const result = await controller.addMessage(dto)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					dto,
				),
			)
		})
	})

	describe('flagAsSeen', () => {
		const dto: FlagAsSeenMessageDTO = {
			token: 'token',
			messageId: 'msgId',
			userId: 'userId',
			conversationId: 'convId',
		}

		it('should flag the message as seen', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					{},
					{
						_id: 'userId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			jest.spyOn(flagAsSeenUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(true),
			)
			const result = await controller.flagAsSeen(dto)

			expect(result.data).toBe(true)
		})

		it('should fail if the user token is incorrect', async () => {
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					HttpStatus.FORBIDDEN,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const result = await controller.flagAsSeen(dto)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					dto,
				),
			)
		})
	})
})
