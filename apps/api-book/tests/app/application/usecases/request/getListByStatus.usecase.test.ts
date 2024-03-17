/* eslint-disable @nx/enforce-module-boundaries */
import GetListByStatusUseCase from '../../../../../src/app/application/usecases/request/getListByStatus.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import { IRequestList, RequestStatus } from '../../../../../../shared/src/'

describe('GetListByStatusUseCase', () => {
	let getListByStatusUseCase: GetListByStatusUseCase
	let requestRepository: RequestRepository

	beforeEach(() => {
		requestRepository = {
			getListByStatus: jest.fn(),
		} as unknown as RequestRepository

		getListByStatusUseCase = new GetListByStatusUseCase(requestRepository)
	})

	describe('handler', () => {
		it('should return request list for the given status', async () => {
			const userId = 'userId'
			const ownerId = 'ownerId'
			const status = RequestStatus.ACCEPTED_PENDING_DELIVERY
			const startAt = 0
			const requestList: IRequestList = {
				results: [],
				total: 0,
			}
			jest.spyOn(
				requestRepository,
				'getListByStatus',
			).mockResolvedValueOnce(requestList)

			const result = await getListByStatusUseCase.handler(
				userId,
				ownerId,
				status,
				startAt,
			)

			expect(result).toEqual(requestList)
			expect(requestRepository.getListByStatus).toHaveBeenCalledWith(
				userId,
				ownerId,
				status,
				startAt,
			)
		})
	})
})
