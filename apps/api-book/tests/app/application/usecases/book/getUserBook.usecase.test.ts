/* eslint-disable @nx/enforce-module-boundaries */
import GetUserBookUseCase from '../../../../../src/app/application/usecases/book/getUserBook.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { NotFoundException } from '@nestjs/common'
import { ILibraryFull } from '../../../../../../shared/src/interfaces/library.interface'

describe('GetUserBookUseCase', () => {
	let getUserBookUseCase: GetUserBookUseCase
	let libraryRepository: LibraryRepository

	beforeEach(() => {
		libraryRepository = {
			getFullById: jest.fn(),
		} as unknown as LibraryRepository
		getUserBookUseCase = new GetUserBookUseCase(libraryRepository)
	})

	describe('handler', () => {
		it('should return the book when it exists', async () => {
			const book: ILibraryFull = {
				_id: '123',
				book: {
					title: 'Title',
					authors: ['author'],
					description: 'desc',
					isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
					language: 'fr',
				},
				location: { type: 'Point', coordinates: [0, 0] },
			}

			jest.spyOn(libraryRepository, 'getFullById').mockResolvedValueOnce(
				book,
			)

			const result = await getUserBookUseCase.handler('123')

			expect(result).toMatchObject(book)
			expect(libraryRepository.getFullById).toHaveBeenCalledWith('123')
		})

		it('should throw NotFoundException when the book does not exist', async () => {
			jest.spyOn(libraryRepository, 'getFullById').mockResolvedValueOnce(
				null,
			)

			await expect(getUserBookUseCase.handler('123')).rejects.toThrow(
				NotFoundException,
			)
			expect(libraryRepository.getFullById).toHaveBeenCalledWith('123')
		})
	})
})
