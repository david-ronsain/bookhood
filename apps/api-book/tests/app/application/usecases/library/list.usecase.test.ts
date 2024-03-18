/* eslint-disable @nx/enforce-module-boundaries */
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import ListUseCase from '../../../../../src/app/application/usecases/library/list.usecase'
import {
	booksList,
	libraryRepository as libRepo,
} from '../../../../../../shared-api/test'

describe('ListUseCase', () => {
	let listUseCase: ListUseCase
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		libraryRepository = { ...libRepo } as unknown as LibraryRepository
		listUseCase = new ListUseCase(libraryRepository)
	})

	describe('handler', () => {
		it('should return the books when it exists', async () => {
			const list = booksList

			jest.spyOn(libraryRepository, 'list').mockResolvedValueOnce(list)

			const result = await listUseCase.handler('123', 0)

			expect(result).toMatchObject(list)
			expect(libraryRepository.list).toHaveBeenCalledWith('123', 0)
		})
	})
})
