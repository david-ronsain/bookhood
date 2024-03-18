/* eslint-disable @nx/enforce-module-boundaries */
import GetListByStatusUseCase from '../../../../../src/app/application/usecases/request/getListByStatus.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import { RequestStatus } from '../../../../../../shared/src/'
import {
	emptyRequestList,
	requestRepository as reqRepo,
} from '../../../../../../shared-api/test'

describe('GetListByStatusUseCase', () => {
	let getListByStatusUseCase: GetListByStatusUseCase
	let requestRepository: RequestRepository

	beforeEach(() => {
		jest.clearAllMocks()
		requestRepository = { ...reqRepo } as unknown as RequestRepository

		getListByStatusUseCase = new GetListByStatusUseCase(requestRepository)
	})

	describe('handler', () => {
		it('should return request list for the given status', async () => {
			const userId = 'userId'
			const ownerId = 'ownerId'
			const status = RequestStatus.ACCEPTED_PENDING_DELIVERY
			const startAt = 0

			jest.spyOn(
				requestRepository,
				'getListByStatus',
			).mockResolvedValueOnce(emptyRequestList)

			const result = await getListByStatusUseCase.handler(
				userId,
				ownerId,
				status,
				startAt,
			)

			expect(result).toMatchObject(emptyRequestList)
			expect(requestRepository.getListByStatus).toHaveBeenCalledWith(
				userId,
				ownerId,
				status,
				startAt,
			)
		})
	})
})
