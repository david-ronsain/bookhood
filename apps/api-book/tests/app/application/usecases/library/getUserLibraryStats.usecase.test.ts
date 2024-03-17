/* eslint-disable @nx/enforce-module-boundaries */
import GetUserLibraryStats from '../../../../../src/app/application/usecases/library/getUserLibraryStats.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { userLibraryStats } from '../../../../../../shared-api/test'

describe('GetUserLibraryStatsUseCase', () => {
	let getUserLibraryStats: GetUserLibraryStats
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		libraryRepository = {
			getStats: jest.fn(),
		} as unknown as LibraryRepository

		getUserLibraryStats = new GetUserLibraryStats(libraryRepository)
	})

	describe('handler', () => {
		it("should return the user's stats", async () => {
			const userId = 'userId'
			const stats = userLibraryStats
			jest.spyOn(libraryRepository, 'getStats').mockResolvedValueOnce(
				stats,
			)

			const result = await getUserLibraryStats.handler(userId)

			expect(result).toEqual(stats)
			expect(libraryRepository.getStats).toHaveBeenCalledWith(userId)
		})
	})
})
