/* eslint-disable @nx/enforce-module-boundaries */
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import GetByIdUseCase from '../../../../../src/app/application/usecases/request/getById.usecase'
import { NotFoundException } from '@nestjs/common'
import {
	requestRepository as reqRepo,
	requestInfos,
} from '../../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('GetByIdUseCase', () => {
	let getById: GetByIdUseCase
	let requestRepository: RequestRepository
	let i18n: I18nService

	beforeEach(() => {
		jest.clearAllMocks()
		requestRepository = { ...reqRepo } as unknown as RequestRepository
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		getById = new GetByIdUseCase(requestRepository, i18n)
	})

	describe('handler', () => {
		it('should return request by its id', async () => {
			const request = requestInfos
			jest.spyOn(
				requestRepository,
				'getRequestInfos',
			).mockResolvedValueOnce(request)

			const result = await getById.handler(request._id)

			expect(result).toMatchObject(request)
			expect(requestRepository.getRequestInfos).toHaveBeenCalledWith(
				request._id,
			)
		})

		it('should throw an error if the request does not exist', async () => {
			jest.spyOn(
				requestRepository,
				'getRequestInfos',
			).mockResolvedValueOnce(null)

			expect(getById.handler('id')).rejects.toThrow(NotFoundException)
		})
	})
})
