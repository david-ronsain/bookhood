/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { Document, Model } from 'mongoose'
import RequestRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/request.repository.mongo'
import { RequestEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/request.entity'
import RequestModel from '../../../../../src/app/domain/models/request.model'
import {
	IRequestInfos,
	IRequestList,
	RequestStatus,
} from '../../../../../../shared/src'
import RequestMapper from '../../../../../src/app/application/mappers/request.mapper'

const mockRequestModel = () => ({
	countDocuments: jest.fn(),
	create: jest.fn(),
	aggregate: jest.fn(),
	findById: jest.fn(),
	findByIdAndUpdate: jest.fn(),
})

describe('RequestRepositoryMongo', () => {
	let repository: RequestRepositoryMongo
	let requestModel: Model<RequestEntity>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RequestRepositoryMongo,
				{ provide: 'RequestModel', useFactory: mockRequestModel },
			],
		}).compile()

		repository = module.get<RequestRepositoryMongo>(RequestRepositoryMongo)
		requestModel = module.get('RequestModel')
	})

	describe('countActiveRequestsForUser', () => {
		it('should return the count of active requests for a user', async () => {
			const userId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const expectedResult = 5

			jest.spyOn(requestModel, 'countDocuments').mockResolvedValue(
				expectedResult,
			)

			const result = await repository.countActiveRequestsForUser(userId)

			expect(result).toEqual(expectedResult)
			expect(requestModel.countDocuments).toHaveBeenCalledWith({
				userId: expect.any(Object),
				status: {
					$in: expect.any(Array),
				},
			})
		})
	})

	describe('create', () => {
		it('should create a new request and return the mapped model', async () => {
			const request = {
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				userId: 'cccccccccccccccccccccccc',
				ownerId: 'dddddddddddddddddddddddd',
				dueDate: new Date().toString(),
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				events: [],
			} as unknown as RequestEntity

			const createdRequest = new RequestModel(request)

			jest.spyOn(requestModel, 'create').mockResolvedValue(
				request as unknown as (Document<
					unknown,
					object,
					RequestEntity
				> &
					RequestEntity &
					Required<{ _id: string }>)[],
			)

			const result = await repository.create(createdRequest)

			expect(requestModel.create).toHaveBeenCalledWith(createdRequest)

			expect(result).toEqual(RequestMapper.fromEntitytoModel(request))
		})
	})

	describe('getListByStatus', () => {
		it('should return a list of requests by status', async () => {
			const userId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const ownerId = 'bbbbbbbbbbbbbbbbbbbbbbbb'
			const status = RequestStatus.PENDING_VALIDATION
			const startAt = 0

			const mockedRequestList: IRequestList[] = [
				{
					total: 1,
					results: [
						{
							_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
							userFirstName: 'first1',
							ownerFirstName: 'first2',
							title: 'title',
							place: 'Some place',
							dueDate: new Date().toString(),
							createdAt: new Date().toString(),
							userId,
							ownerId,
						},
					],
				},
			]

			jest.spyOn(requestModel, 'aggregate').mockResolvedValue(
				mockedRequestList,
			)

			const result = await repository.getListByStatus(
				userId,
				ownerId,
				status,
				startAt,
			)

			expect(result).toEqual(mockedRequestList[0])
		})
	})

	describe('getById', () => {
		it('should return a request by ID if found', async () => {
			jest.spyOn(requestModel, 'findById').mockResolvedValue(
				{} as unknown as RequestEntity,
			)
			expect(
				repository.getById('aaaaaaaaaaaaaaaaaaaaaaaa'),
			).resolves.not.toBeNull()
		})

		it('should return null if no request is found', async () => {
			jest.spyOn(requestModel, 'findById').mockResolvedValue(null)
			expect(
				repository.getById('aaaaaaaaaaaaaaaaaaaaaaaa'),
			).resolves.toBeNull()
		})
	})

	describe('patch', () => {
		it('should update and return the patched request', async () => {
			const requestId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const status = RequestStatus.PENDING_VALIDATION
			const events = []

			const entity = {
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				userId: 'cccccccccccccccccccccccc',
				ownerId: 'dddddddddddddddddddddddd',
				dueDate: new Date().toString(),
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				events: [],
			} as unknown as RequestEntity

			const model = new RequestModel(entity)

			jest.spyOn(requestModel, 'findByIdAndUpdate').mockResolvedValue(
				entity,
			)

			const result = await repository.patch(requestId, status, events)

			expect(result).toMatchObject(model)
		})

		it('should return null if no request is found', async () => {
			const requestId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const status = RequestStatus.PENDING_VALIDATION
			const events = []

			jest.spyOn(requestModel, 'findByIdAndUpdate').mockResolvedValue(
				null,
			)

			const result = await repository.patch(requestId, status, events)

			expect(result).toBeNull()
		})
	})

	describe('getRequestInfos', () => {
		it('should return request infos', async () => {
			const requestId = 'aaaaaaaaaaaaaaaaaaaaaaaa'

			const mockedResults: IRequestInfos[] = [
				{
					_id: 'request_id',
					createdAt: new Date().toString(),
					emitter: {
						firstName: 'John',
						lastName: 'Doe',
						email: 'john@example.com',
					},
					owner: {
						firstName: 'Jane',
						lastName: 'Doe',
						email: 'jane@example.com',
					},
					book: {
						title: 'Sample Book',
					},
				},
			]

			jest.spyOn(requestModel, 'aggregate').mockResolvedValue(
				mockedResults,
			)

			const result = await repository.getRequestInfos(requestId)

			expect(result).toEqual(mockedResults[0])
		})

		it('should return null if no request is found', async () => {
			const requestId = 'aaaaaaaaaaaaaaaaaaaaaaaa'

			jest.spyOn(requestModel, 'aggregate').mockResolvedValue([])

			const result = await repository.getRequestInfos(requestId)

			expect(result).toBeNull()
		})
	})
})
