/* eslint-disable @nx/enforce-module-boundaries */
import GetListByStatusUseCase from '../../../../../src/app/application/usecases/request/getListByStatus.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import {
	IRequestInfos,
	IRequestList,
	RequestStatus,
} from '../../../../../../shared/src'
import GetByIdUseCase from '../../../../../src/app/application/usecases/request/getById.usecase'
import { NotFoundException } from '@nestjs/common'

describe('GetByIdUseCase', () => {
	let getById: GetByIdUseCase
	let requestRepository: RequestRepository

	beforeEach(() => {
		requestRepository = {
			getRequestInfos: jest.fn(),
		} as unknown as RequestRepository

		getById = new GetByIdUseCase(requestRepository)
	})

	describe('handler', () => {
		it('should return request by its id', async () => {
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
