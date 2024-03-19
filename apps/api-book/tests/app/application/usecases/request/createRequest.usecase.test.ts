/* eslint-disable @nx/enforce-module-boundaries */
import CreateRequestUseCase from '../../../../../src/app/application/usecases/request/createRequest.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import RequestModel from '../../../../../src/app/domain/models/request.model'
import RequestMapper from '../../../../../src/app/application/mappers/request.mapper'
import {
	requestRepository as reqRepo,
	libraryRepository as libRepo,
	request as req,
	libraryModel,
} from '../../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('CreateRequestUseCase', () => {
	let createRequestUseCase: CreateRequestUseCase
	let requestRepository: RequestRepository
	let libraryRepository: LibraryRepository
	let i18n: I18nService

	beforeEach(() => {
		jest.clearAllMocks()
		requestRepository = { ...reqRepo } as unknown as RequestRepository
		libraryRepository = { ...libRepo } as unknown as LibraryRepository
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		createRequestUseCase = new CreateRequestUseCase(
			requestRepository,
			libraryRepository,
			i18n,
		)
	})

	describe('handler', () => {
		it('should create a request when conditions are met', async () => {
			const dates = ['0000-00-00', '0000-00-00']
			const request = req
			const library = libraryModel

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
				dates,
			)

			expect(result).toEqual(expectedRequest)
			expect(libraryRepository.getById).toHaveBeenCalledWith(
				request.libraryId,
			)
			expect(
				requestRepository.countActiveRequestsForUser,
			).toHaveBeenCalledWith(request.userId, dates)
			expect(requestRepository.create).toHaveBeenCalledWith(
				expect.any(RequestModel),
			)
		})

		it('should throw NotFoundException when the library does not exist', async () => {
			jest.spyOn(libraryRepository, 'getById').mockResolvedValueOnce(null)

			await expect(
				createRequestUseCase.handler('userId', 'libraryId', [
					'0000-00-00',
					'0000-00-00',
				]),
			).rejects.toThrow(NotFoundException)

			expect(libraryRepository.getById).toHaveBeenCalledWith('libraryId')
			expect(
				requestRepository.countActiveRequestsForUser,
			).not.toHaveBeenCalled()
			expect(requestRepository.create).not.toHaveBeenCalled()
		})

		it('should throw ForbiddenException when user has active requests', async () => {
			const dates = ['0000-00-00', '0000-00-00']
			const library = libraryModel
			jest.spyOn(libraryRepository, 'getById').mockResolvedValueOnce(
				library,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(1)

			await expect(
				createRequestUseCase.handler('userId', 'libraryId', dates),
			).rejects.toThrow(ForbiddenException)
			expect(libraryRepository.getById).toHaveBeenCalledWith('libraryId')
			expect(
				requestRepository.countActiveRequestsForUser,
			).toHaveBeenCalledWith('userId', dates)
			expect(requestRepository.create).not.toHaveBeenCalled()
		})
	})
})
