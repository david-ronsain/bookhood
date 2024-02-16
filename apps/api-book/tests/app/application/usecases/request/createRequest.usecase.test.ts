/* eslint-disable @nx/enforce-module-boundaries */
import CreateRequestUseCase from '../../../../../src/app/application/usecases/request/createRequest.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { IRequest } from '../../../../../../shared/src/interfaces/request.interface'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import RequestModel from '../../../../../src/app/domain/models/request.model'
import RequestMapper from '../../../../../src/app/application/mappers/request.mapper'
import { LibraryStatus, RequestStatus } from '../../../../../../shared/src'
import LibraryModel from '../../../../../src/app/domain/models/library.model'
import mongoose from 'mongoose'

describe('CreateRequestUseCase', () => {
	let createRequestUseCase: CreateRequestUseCase
	let requestRepository: RequestRepository
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		requestRepository = {
			create: jest.fn(),
			countActiveRequestsForUser: jest.fn(),
		} as unknown as RequestRepository

		libraryRepository = {
			getById: jest.fn(),
		} as unknown as LibraryRepository

		createRequestUseCase = new CreateRequestUseCase(
			requestRepository,
			libraryRepository,
		)
	})

	describe('handler', () => {
		it('should create a request when conditions are met', async () => {
			const request: IRequest = {
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				ownerId: 'cccccccccccccccccccccccc',
				userId: 'dddddddddddddddddddddddd',
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}
			const library: LibraryModel = {
				userId: new mongoose.Types.ObjectId(),
				bookId: new mongoose.Types.ObjectId(),
				status: LibraryStatus.TO_LEND,
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
				place: 'Some place',
			}

			jest.spyOn(libraryRepository, 'getById').mockResolvedValueOnce(
				library,
			)

			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(0)

			jest.spyOn(requestRepository, 'create').mockResolvedValueOnce(
				new RequestModel(request),
			)
			const expectedRequest = RequestMapper.modelObjectIdToString(
				new RequestModel(request),
			)

			const result = await createRequestUseCase.handler(
				request.userId,
				request.libraryId,
			)

			expect(result).toEqual(expectedRequest)
			expect(libraryRepository.getById).toHaveBeenCalledWith(
				request.libraryId,
			)
			expect(
				requestRepository.countActiveRequestsForUser,
			).toHaveBeenCalledWith(request.userId)
			expect(requestRepository.create).toHaveBeenCalledWith(
				expect.any(RequestModel),
			)
		})

		it('should throw NotFoundException when the library does not exist', async () => {
			jest.spyOn(libraryRepository, 'getById').mockResolvedValueOnce(null)

			await expect(
				createRequestUseCase.handler('userId', 'libraryId'),
			).rejects.toThrow(NotFoundException)

			expect(libraryRepository.getById).toHaveBeenCalledWith('libraryId')
			expect(
				requestRepository.countActiveRequestsForUser,
			).not.toHaveBeenCalled()
			expect(requestRepository.create).not.toHaveBeenCalled()
		})

		it('should throw ForbiddenException when user has active requests', async () => {
			const library: LibraryModel = {
				userId: new mongoose.Types.ObjectId(),
				bookId: new mongoose.Types.ObjectId(),
				status: LibraryStatus.TO_LEND,
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
				place: 'Some place',
			}
			jest.spyOn(libraryRepository, 'getById').mockResolvedValueOnce(
				library,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(1)

			await expect(
				createRequestUseCase.handler('userId', 'libraryId'),
			).rejects.toThrow(ForbiddenException)
			expect(libraryRepository.getById).toHaveBeenCalledWith('libraryId')
			expect(
				requestRepository.countActiveRequestsForUser,
			).toHaveBeenCalledWith('userId')
			expect(requestRepository.create).not.toHaveBeenCalled()
		})
	})
})
