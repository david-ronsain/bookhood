/* eslint-disable @nx/enforce-module-boundaries */
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { IBooksList, LibraryStatus } from '../../../../../../shared/src'
import ListUseCase from '../../../../../src/app/application/usecases/library/list.usecase'

describe('ListUseCase', () => {
	let listUseCase: ListUseCase
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		libraryRepository = {
			list: jest.fn(),
		} as unknown as LibraryRepository
		listUseCase = new ListUseCase(libraryRepository)
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
						categories: ['category'],
					},
				],
			}

			jest.spyOn(libraryRepository, 'list').mockResolvedValueOnce(list)

			const result = await listUseCase.handler('123', 0)

			expect(result).toMatchObject(list)
			expect(libraryRepository.list).toHaveBeenCalledWith('123', 0)
		})
	})
})
