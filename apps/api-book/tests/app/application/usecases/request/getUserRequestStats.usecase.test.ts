/* eslint-disable @nx/enforce-module-boundaries */
import GetUserRequestStatsUseCase from '../../../../../src/app/application/usecases/request/getUserRequestStats.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import { userRequestStats } from '../../../../../../shared-api/test/data/books/request'
import { requestRepository as reqRepo } from '../../../../../../shared-api/test'

describe('GetUserRequestStatsUseCase', () => {
	let getUserRequestStatsUseCase: GetUserRequestStatsUseCase
	let requestRepository: RequestRepository

	beforeEach(() => {
		requestRepository = { ...reqRepo } as unknown as RequestRepository

		getUserRequestStatsUseCase = new GetUserRequestStatsUseCase(
			requestRepository,
		)
	})

	describe('handler', () => {
		it("should return the user's stats", async () => {
			const userId = 'userId'
			const stats = userRequestStats
			jest.spyOn(requestRepository, 'getStats').mockResolvedValueOnce(
				stats,
			)

			const result = await getUserRequestStatsUseCase.handler(userId)

			expect(result).toEqual(stats)
			expect(requestRepository.getStats).toHaveBeenCalledWith(userId)
		})
	})
})
