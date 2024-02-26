/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import {
	HttpStatus,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common'
import { RequestController } from '../../../../src/app/application/controllers/request.controller'
import CreateRequestUseCase from '../../../../src/app/application/usecases/request/createRequest.usecase'
import GetUserBookUseCase from '../../../../src/app/application/usecases/book/getUserBook.usecase'
import GetListByStatusUseCase from '../../../../src/app/application/usecases/request/getListByStatus.usecase'
import PatchRequestUseCase from '../../../../src/app/application/usecases/request/patchRequest.usecase'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import {
	CreateRequestDTO,
	GetRequestsDTO,
} from '../../../../src/app/application/dto/request.dto'
import {
	ILibraryFull,
	IRequest,
	IRequestInfos,
	IRequestList,
	IRequestSimple,
	RequestStatus,
} from '../../../../../shared/src'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, of } from 'rxjs'
import { PatchRequestMQDTO } from '../../../../../shared-api/src'
import GetByIdUseCase from '../../../../src/app/application/usecases/request/getById.usecase'

describe('RequestController', () => {
	let controller: RequestController
	let createRequestUseCase: CreateRequestUseCase
	let getUserBookUseCase: GetUserBookUseCase
	let getListByStatusUseCase: GetListByStatusUseCase
	let patchRequestUseCase: PatchRequestUseCase
	let getByIdUseCase: GetByIdUseCase
	let userClient: ClientProxy
	let mailClient: ClientProxy

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RequestController],
			providers: [
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: mockLogger,
				},
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
				{ provide: 'RabbitMail', useValue: { send: jest.fn() } },
				{
					provide: CreateRequestUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: GetUserBookUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: GetListByStatusUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: PatchRequestUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: GetByIdUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
			],
		}).compile()

		controller = module.get<RequestController>(RequestController)
		createRequestUseCase =
			module.get<CreateRequestUseCase>(CreateRequestUseCase)
		getUserBookUseCase = module.get<GetUserBookUseCase>(GetUserBookUseCase)
		getListByStatusUseCase = module.get<GetListByStatusUseCase>(
			GetListByStatusUseCase,
		)
		patchRequestUseCase =
			module.get<PatchRequestUseCase>(PatchRequestUseCase)
		getByIdUseCase = module.get<GetByIdUseCase>(GetByIdUseCase)
		userClient = module.get<ClientProxy>('RabbitUser')
		mailClient = module.get<ClientProxy>('RabbitMail')
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('create', () => {
		it('should create a request successfully', async () => {
			const request: CreateRequestDTO = {
				token: 'token',
				libraryId: '123',
			}
			const lib: ILibraryFull = {
				book: {
					title: 'Title',
					authors: ['author'],
					isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
					description: 'desc',
					language: 'fr',
				},
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
				user: {
					firstName: 'first',
					lastName: 'last',
					email: 'first.last@name.test',
				},
			}
			const createdRequest: IRequest = {
				_id: 'requestId',
				libraryId: '123',
				ownerId: '456',
				userId: '789',
				status: RequestStatus.PENDING_VALIDATION,
			}
			const expectedResult = new MicroserviceResponseFormatter(
				true,
				HttpStatus.OK,
				request,
				createdRequest,
			)
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)
			jest.spyOn(mailClient, 'send').mockReturnValue(of({}))
			jest.spyOn(createRequestUseCase, 'handler').mockResolvedValue(
				createdRequest,
			)
			jest.spyOn(getUserBookUseCase, 'handler').mockResolvedValue(lib)

			const result = await controller.create(request)

			expect(result).toEqual(expectedResult)
		})

		it('should throw not found error', async () => {
			const request: CreateRequestDTO = {
				token: 'token',
				libraryId: '123',
			}
			const lib: ILibraryFull = {
				book: {
					title: 'Title',
					authors: ['author'],
					isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
					description: 'desc',
					language: 'fr',
				},
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
				user: {
					firstName: 'first',
					lastName: 'last',
					email: 'first.last@name.test',
				},
			}
			const expectedResult = new MicroserviceResponseFormatter(
				false,
				HttpStatus.NOT_FOUND,
				request,
				undefined,
				expect.anything(),
			)
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)
			jest.spyOn(mailClient, 'send').mockReturnValue(of({}))
			jest.spyOn(createRequestUseCase, 'handler').mockRejectedValue(
				new NotFoundException(),
			)
			jest.spyOn(getUserBookUseCase, 'handler').mockResolvedValue(lib)

			const result = await controller.create(request)

			expect(result).toMatchObject(expectedResult)
		})

		it('should throw forbidden error', async () => {
			const request: CreateRequestDTO = {
				token: 'token',
				libraryId: '123',
			}
			const lib: ILibraryFull = {
				book: {
					title: 'Title',
					authors: ['author'],
					isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
					description: 'desc',
					language: 'fr',
				},
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
				user: {
					firstName: 'first',
					lastName: 'last',
					email: 'first.last@name.test',
				},
			}
			const expectedResult = new MicroserviceResponseFormatter(
				false,
				HttpStatus.FORBIDDEN,
				request,
				undefined,
				expect.anything(),
			)
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)
			jest.spyOn(mailClient, 'send').mockReturnValue(of({}))
			jest.spyOn(createRequestUseCase, 'handler').mockRejectedValue(
				new ForbiddenException(),
			)
			jest.spyOn(getUserBookUseCase, 'handler').mockResolvedValue(lib)

			const result = await controller.create(request)

			expect(result).toMatchObject(expectedResult)
		})
	})

	describe('getByListStatus', () => {
		it('should return a list of requests', async () => {
			const mockRequest: IRequestSimple = {
				_id: 'request_id',
				userFirstName: 'userFirstName',
				ownerFirstName: 'ownerFirstName',
				title: 'title',
				place: 'Paris',
				userId: 'user_id',
				ownerId: 'owner_id',
				createdAt: new Date().toString(),
				dueDate: new Date().toString(),
			}
			const mockRequestList: IRequestList = {
				results: [mockRequest],
				total: 1,
			}
			const dto: GetRequestsDTO = {
				token: 'token',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				startAt: 0,
			}
			const expectedResult =
				new MicroserviceResponseFormatter<IRequestList>(
					true,
					HttpStatus.OK,
					dto,
					mockRequestList,
				)
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)

			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			jest.spyOn(getListByStatusUseCase, 'handler').mockResolvedValue(
				mockRequestList,
			)

			const result = await controller.getByListStatus(dto)

			expect(result).toMatchObject(expectedResult)
		})

		it('should return error when user token is invalid', async () => {
			const mockRequest: IRequestSimple = {
				_id: 'request_id',
				userFirstName: 'userFirstName',
				ownerFirstName: 'ownerFirstName',
				title: 'title',
				place: 'Paris',
				userId: 'user_id',
				ownerId: 'owner_id',
				createdAt: new Date().toString(),
				dueDate: new Date().toString(),
			}
			const mockRequestList: IRequestList = {
				results: [mockRequest],
				total: 1,
			}
			const dto: GetRequestsDTO = {
				token: undefined as unknown as string,
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				startAt: 0,
			}
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					200,
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

			jest.spyOn(getListByStatusUseCase, 'handler').mockResolvedValue(
				mockRequestList,
			)

			const result = await controller.getByListStatus(dto)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter().buildFromException(
					new ForbiddenException(),
					expect.anything(),
				),
			)
		})
	})

	describe('update', () => {
		it('should update request status', async () => {
			const mockPatchedRequest: IRequest = {
				_id: '012',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				libraryId: '123',
				ownerId: '456',
				userId: '789',
			}
			const patchRequestDTO: PatchRequestMQDTO = {
				token: 'token',
				requestId: 'request_id',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}

			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)

			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			jest.spyOn(patchRequestUseCase, 'handler').mockResolvedValue(
				mockPatchedRequest,
			)

			const result = await controller.update(patchRequestDTO)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter<IRequest>(
					true,
					HttpStatus.OK,
					patchRequestDTO,
					mockPatchedRequest,
				),
			)
		})

		it('should return error when user token is invalid', async () => {
			const patchRequestDTO: PatchRequestMQDTO = {
				token: 'token',
				requestId: 'request_id',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}

			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					403,
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

			const result = await controller.update(patchRequestDTO)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter<IRequest>().buildFromException(
					new ForbiddenException(),
					patchRequestDTO,
				),
			)
		})

		it('should throw not found exception', async () => {
			const patchRequestDTO: PatchRequestMQDTO = {
				token: 'token',
				requestId: 'request_id',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}

			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)

			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			jest.spyOn(patchRequestUseCase, 'handler').mockRejectedValue(
				new NotFoundException(),
			)

			const result = await controller.update(patchRequestDTO)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter<IRequest>().buildFromException(
					new NotFoundException(),
					patchRequestDTO,
				),
			)
		})

		it('should throw forbidden exception', async () => {
			const patchRequestDTO: PatchRequestMQDTO = {
				token: 'token||',
				requestId: 'request_id',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}

			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)

			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			jest.spyOn(patchRequestUseCase, 'handler').mockRejectedValue(
				new ForbiddenException(),
			)

			const result = await controller.update(patchRequestDTO)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter<IRequest>().buildFromException(
					new ForbiddenException(),
					patchRequestDTO,
				),
			)
		})
	})

	describe('getById', () => {
		it('should return the request', async () => {
			const request: IRequestInfos = {
				_id: 'request_id',
				book: {
					title: 'title',
				},
				createdAt: '',
				emitter: {
					firstName: 'first',
					lastName: 'last',
					email: 'first.last@name.test',
				},
				owner: {
					firstName: 'first1',
					lastName: 'last1',
					email: 'first1.last1@name.test',
				},
			}
			const dto = {
				requestId: 'id',
			}
			const expectedResult =
				new MicroserviceResponseFormatter<IRequestInfos>(
					true,
					HttpStatus.OK,
					dto,
					request,
				)

			jest.spyOn(getByIdUseCase, 'handler').mockResolvedValue(request)

			const result = await controller.getById(dto.requestId)

			expect(result).toMatchObject(expectedResult)
		})

		it('should return error', async () => {
			const error = new NotFoundException()
			const dto = {
				requestId: 'id',
			}

			jest.spyOn(getByIdUseCase, 'handler').mockRejectedValueOnce(error)

			const result = await controller.getById(dto.requestId)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter().buildFromException(
					new NotFoundException(),
					expect.anything(),
				),
			)
		})
	})
})
