/* eslint-disable @nx/enforce-module-boundaries */
import GetUserBooksUseCase from '../../../../../src/app/application/usecases/book/getUserBooks.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { ILibraryFull } from '../../../../../../shared/src/interfaces/library.interface'

describe('GetUserBookUseCase', () => {
	let getUserBooksUseCase: GetUserBooksUseCase
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		libraryRepository = {
			getByUser: jest.fn(),
		} as unknown as LibraryRepository
		getUserBooksUseCase = new GetUserBooksUseCase(libraryRepository)
	})

	describe('handler', () => {
		it('should return the books when it exists', async () => {
			const book: ILibraryFull[] = [
				{
					_id: '123',
					book: {
						title: 'Title',
						authors: ['author'],
						description: 'desc',
						isbn: [
							{ type: 'ISBN_13', identifier: '0123456789123' },
						],
						language: 'fr',
					},
					location: { type: 'Point', coordinates: [0, 0] },
				},
			]

			jest.spyOn(libraryRepository, 'getByUser').mockResolvedValueOnce(
				book,
			)

			const result = await getUserBooksUseCase.handler('123', 0)

			expect(result).toMatchObject(book)
			expect(libraryRepository.getByUser).toHaveBeenCalledWith('123', 0)
		})
	})
})
