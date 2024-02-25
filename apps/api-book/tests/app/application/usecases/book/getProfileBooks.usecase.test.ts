/* eslint-disable @nx/enforce-module-boundaries */
import GetProfileBooksUseCase from '../../../../../src/app/application/usecases/book/getProfileBooks.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { IBooksList, LibraryStatus } from '../../../../../../shared/src'

describe('GetProfileBooksUseCase', () => {
	let getProfileBooksUseCase: GetProfileBooksUseCase
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		libraryRepository = {
			getProfileBooks: jest.fn(),
		} as unknown as LibraryRepository
		getProfileBooksUseCase = new GetProfileBooksUseCase(libraryRepository)
	})

	describe('handler', () => {
		it('should return the books when it exists', async () => {
			const list: IBooksList = {
				total: 1,
				results: [
					{
						_id: 'aaaaaaaaaaaa',
						authors: ['author'],
						description: 'description',
						place: 'place',
						status: LibraryStatus.TO_LEND,
						title: 'title',
					},
				],
			}

			jest.spyOn(
				libraryRepository,
				'getProfileBooks',
			).mockResolvedValueOnce(list)

			const result = await getProfileBooksUseCase.handler('123', 0)

			expect(result).toMatchObject(list)
			expect(libraryRepository.getProfileBooks).toHaveBeenCalledWith(
				'123',
				0,
			)
		})
	})
})
