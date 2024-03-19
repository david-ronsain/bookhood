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
	IRequest,
	IRequestInfos,
	IRequestList,
	Locale,
	RequestStatus,
} from '../../../../../shared/src'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { ClientProxy } from '@nestjs/microservices'
import { of } from 'rxjs'
import {
	CreateRequestMQDTO,
	GetRequestsMQDTO,
	PatchRequestMQDTO,
} from '../../../../../shared-api/src'
import GetByIdUseCase from '../../../../src/app/application/usecases/request/getById.usecase'
import {
	libraryFull,
	currentUser,
	request,
	requestsList,
	requestInfos,
	requestList,
} from '../../../../../shared-api/test/'

describe('RequestController', () => {
	let controller: RequestController
	let createRequestUseCase: CreateRequestUseCase
	let getUserBookUseCase: GetUserBookUseCase
	let getListByStatusUseCase: GetListByStatusUseCase
	let patchRequestUseCase: PatchRequestUseCase
	let getByIdUseCase: GetByIdUseCase
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
		mailClient = module.get<ClientProxy>('RabbitMail')
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('create', () => {
		const requestDTO: CreateRequestMQDTO = {
			user: currentUser,
			libraryId: '123',
			dates: ['0000-00-00', '0000-00-00'],
			session: {
				locale: Locale.FR,
			},
		}

		it('should create a request successfully', async () => {
			const expectedResult = new MicroserviceResponseFormatter(
				true,
				HttpStatus.OK,
				requestDTO,
				request,
			)

			jest.spyOn(mailClient, 'send').mockReturnValue(of({}))
			jest.spyOn(createRequestUseCase, 'handler').mockResolvedValue(
				request,
			)
			jest.spyOn(getUserBookUseCase, 'handler').mockResolvedValue(
				libraryFull,
			)

			const result = await controller.create(requestDTO)

			expect(result).toEqual(expectedResult)
		})

		it('should throw not found error', async () => {
			const expectedResult = new MicroserviceResponseFormatter(
				false,
				HttpStatus.NOT_FOUND,
				requestDTO,
				undefined,
				expect.anything(),
			)

			jest.spyOn(mailClient, 'send').mockReturnValue(of({}))
			jest.spyOn(createRequestUseCase, 'handler').mockRejectedValue(
				new NotFoundException(),
			)
			jest.spyOn(getUserBookUseCase, 'handler').mockResolvedValue(
				libraryFull,
			)

			const result = await controller.create(requestDTO)

			expect(result).toMatchObject(expectedResult)
		})

		it('should throw forbidden error', async () => {
			const expectedResult = new MicroserviceResponseFormatter(
				false,
				HttpStatus.FORBIDDEN,
				requestDTO,
				undefined,
				expect.anything(),
			)

			jest.spyOn(mailClient, 'send').mockReturnValue(of({}))
			jest.spyOn(createRequestUseCase, 'handler').mockRejectedValue(
				new ForbiddenException(),
			)
			jest.spyOn(getUserBookUseCase, 'handler').mockResolvedValue(
				libraryFull,
			)

			const result = await controller.create(requestDTO)

			expect(result).toMatchObject(expectedResult)
		})
	})

	describe('getByListStatus', () => {
		const dto: GetRequestsMQDTO = {
			user: currentUser,
			status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			startAt: 0,
			session: {
				locale: Locale.FR,
			},
		}

		it('should return a list of requests', async () => {
			const expectedResult =
				new MicroserviceResponseFormatter<IRequestList>(
					true,
					HttpStatus.OK,
					dto,
					requestList,
				)

			jest.spyOn(getListByStatusUseCase, 'handler').mockResolvedValue(
				requestList,
			)

			const result = await controller.getByListStatus(dto)

			expect(result).toMatchObject(expectedResult)
		})

		it('should throw an error', async () => {
			jest.spyOn(getListByStatusUseCase, 'handler').mockRejectedValue(
				new Error(),
			)

			const result = await controller.getByListStatus(dto)

			expect(result).toMatchObject(
				new MicroserviceResponseFormatter().buildFromException(
					new Error(),
					expect.anything(),
				),
			)
		})
	})

	describe('update', () => {
		const patchRequestDTO: PatchRequestMQDTO = {
			user: currentUser,
			requestId: 'request_id',
			status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			session: {
				locale: Locale.FR,
			},
		}

		it('should update request status', async () => {
			const mockPatchedRequest: IRequest = {
				...request,
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}

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

		it('should throw not found exception', async () => {
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
			const dto = {
				requestId: 'id',
			}
			const expectedResult =
				new MicroserviceResponseFormatter<IRequestInfos>(
					true,
					HttpStatus.OK,
					dto,
					requestInfos,
				)

			jest.spyOn(getByIdUseCase, 'handler').mockResolvedValue(
				requestInfos,
			)

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
