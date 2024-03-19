/* eslint-disable @nx/enforce-module-boundaries */
import GetUserBookUseCase from '../../../../../src/app/application/usecases/book/getUserBook.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import { NotFoundException } from '@nestjs/common'
import {
	libraryFull,
	libraryRepository as libRepo,
} from '../../../../../../shared-api/test'
import { ILibraryFull } from '../../../../../../shared/src'
import { I18nService } from 'nestjs-i18n'

describe('GetUserBookUseCase', () => {
	let getUserBookUseCase: GetUserBookUseCase
	let libraryRepository: LibraryRepository
	let i18n: I18nService

	beforeEach(() => {
		jest.clearAllMocks()
		libraryRepository = libRepo as unknown as LibraryRepository
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		getUserBookUseCase = new GetUserBookUseCase(libraryRepository, i18n)
	})

	describe('handler', () => {
		it('should return the book when it exists', async () => {
			const book: ILibraryFull = { ...libraryFull }

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
