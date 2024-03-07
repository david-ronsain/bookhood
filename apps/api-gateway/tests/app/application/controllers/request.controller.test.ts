/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { RequestController } from '../../../../src/app/application/controllers/request.controller'
import { ClientProxy } from '@nestjs/microservices'
import { HttpException, HttpStatus } from '@nestjs/common'
import { of } from 'rxjs'
import {
	CurrentUser,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src'
import {
	RequestStatus,
	IRequest,
	IRequestList,
	IPatchRequestDTO,
	Role,
} from '../../../../../shared/src'
import { GetRequestsDTO } from '../../../../src/app/application/dto/request.dto'

jest.mock('@nestjs/microservices', () => ({
	ClientProxy: jest.fn(() => ({
		send: jest.fn(),
	})),
}))

describe('RequestController', () => {
	let controller: RequestController

	const currentUser: CurrentUser = {
		_id: 'userId',
		token: 'token',
		email: 'first.last@name.test',
		roles: [Role.ADMIN],
		firstName: 'first',
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RequestController],
			providers: [
				{
					provide: 'RabbitBook',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
				{
					provide: 'RabbitUser',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
			],
		}).compile()

		controller = module.get<RequestController>(RequestController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('create', () => {
		it('should create a request', async () => {
			const libraryId = 'id'
			const dates = ['0000-00-00', '0000-00-00']

			const response = new MicroserviceResponseFormatter<IRequest>(
				true,
				HttpStatus.CREATED,
				{},
				{
					_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
					libraryId,
					userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
					ownerId: 'cccccccccccccccccccccccc',
					status: RequestStatus.PENDING_VALIDATION,
				},
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.create(currentUser, libraryId, {
				dates,
			})

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'request-create',
				{
					libraryId,
					user: currentUser,
					dates,
				},
			)

			expect(result).toMatchObject({ libraryId })
		})

		it('should throw an error if the microservice returns an error', async () => {
			const libraryId = 'id'
			const dates = ['0000-00-00', '0000-00-00']

			const response = new MicroserviceResponseFormatter<IRequest>(
				false,
				HttpStatus.BAD_REQUEST,
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.create(currentUser, libraryId, {
					dates: dates,
				}),
			).rejects.toThrow(HttpException)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'request-create',
				{
					libraryId,
					user: currentUser,
					dates,
				},
			)
		})
	})

	describe('getistByStatus', () => {
		const data: GetRequestsDTO = {
			status: RequestStatus.PENDING_VALIDATION,
			ownerId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
			startAt: 0,
		}

		it('should return a list of requests', async () => {
			const response = new MicroserviceResponseFormatter<IRequestList>(
				true,
				HttpStatus.OK,
				{},
				{
					results: [
						{
							_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
							userFirstName: 'first',
							ownerFirstName: 'last',
							title: 'title',
							place: 'Some place',
							createdAt: new Date().toString(),
							userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
							ownerId: 'cccccccccccccccccccccccc',
						},
					],
					total: 1,
				},
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getListByStatus(currentUser, data)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'request-list',
				{
					...data,
					user: currentUser,
				},
			)

			expect(result).toMatchObject({
				total: 1,
				results: [{ title: 'title' }],
			})
		})

		it('should throw an error if the microservice returns an error', async () => {
			const response = new MicroserviceResponseFormatter<IRequest>(
				false,
				HttpStatus.BAD_REQUEST,
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.getListByStatus(currentUser, data),
			).rejects.toThrow(HttpException)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'request-list',
				{
					...data,
					user: currentUser,
				},
			)
		})
	})

	describe('patch', () => {
		const data: IPatchRequestDTO = {
			status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
		}
		const requestId = 'aaaaaaaaaaaaaaaaaaaa'

		it('should update a request', async () => {
			const response = new MicroserviceResponseFormatter<IRequest>(
				true,
				HttpStatus.OK,
				{},
				{
					_id: requestId,
					libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
					userId: 'cccccccccccccccccccccccc',
					ownerId: 'dddddddddddddddddddddddd',
					status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				},
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.patch(currentUser, data, requestId)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'request-patch',
				{
					...data,
					requestId,
					user: currentUser,
				},
			)

			expect(result).toMatchObject({
				_id: requestId,
			})
		})

		it('should throw an error if the microservice returns an error', async () => {
			const response = new MicroserviceResponseFormatter<IRequest>(
				false,
				HttpStatus.BAD_REQUEST,
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.patch(currentUser, data, requestId),
			).rejects.toThrow(HttpException)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'request-patch',
				{
					...data,
					requestId,
					user: currentUser,
				},
			)
		})
	})
})
