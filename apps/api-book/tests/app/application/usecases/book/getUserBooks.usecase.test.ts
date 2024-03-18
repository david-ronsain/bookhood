/* eslint-disable @nx/enforce-module-boundaries */
import GetUserBooksUseCase from '../../../../../src/app/application/usecases/book/getUserBooks.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { ILibraryFull } from '../../../../../../shared/src/interfaces/library.interface'
import {
	libraryRepository as libRepo,
	librariesFull,
} from '../../../../../../shared-api/test'

describe('GetUserBookUseCase', () => {
	let getUserBooksUseCase: GetUserBooksUseCase
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		jest.clearAllMocks()
		libraryRepository = libRepo as unknown as LibraryRepository

		getUserBooksUseCase = new GetUserBooksUseCase(libraryRepository)
	})

	describe('handler', () => {
		it('should return the books when it exists', async () => {
			const book: ILibraryFull[] = [...librariesFull]

			jest.spyOn(libraryRepository, 'getByUser').mockResolvedValueOnce(
				book,
			)

			const result = await getUserBooksUseCase.handler('123', 0)

			expect(result).toMatchObject(book)
			expect(libraryRepository.getByUser).toHaveBeenCalledWith('123', 0)
		})
	})
})
