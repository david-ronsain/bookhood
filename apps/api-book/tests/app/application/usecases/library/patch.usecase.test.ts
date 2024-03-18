/* eslint-disable @nx/enforce-module-boundaries */
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import LibraryModel from '../../../../../src/app/domain/models/library.model'
import mongoose from 'mongoose'
import { ILibrary, LibraryStatus } from '../../../../../../shared/src'
import PatchUseCase from '../../../../../src/app/application/usecases/library/patch.usecase'
import {
	libraryModel,
	libraryRepository,
} from '../../../../../../shared-api/test'

describe('PatchUseCase', () => {
	let patchUseCase: PatchUseCase
	let libraryRepositoryMock: LibraryRepository

	const mockedLib = libraryModel

	beforeEach(() => {
		jest.clearAllMocks()
		libraryRepositoryMock = { ...libraryRepository }

		patchUseCase = new PatchUseCase(libraryRepositoryMock)
	})

	describe('Testing the handler', () => {
		it('should throw a NotFoundException', () => {
			jest.spyOn(libraryRepositoryMock, 'getById').mockImplementationOnce(
				() => Promise.resolve(null),
			)

			expect(
				patchUseCase.handler(
					mockedLib.userId.toString(),
					'libraryId',
					LibraryStatus.TO_LEND,
				),
			).rejects.toThrow(NotFoundException)
		})

		it('should throw a ForbiddenException', () => {
			jest.spyOn(libraryRepositoryMock, 'getById').mockImplementationOnce(
				() => Promise.resolve(mockedLib),
			)

			expect(
				patchUseCase.handler(
					'userId',
					'libraryId',
					LibraryStatus.TO_GIVE,
				),
			).rejects.toThrow(ForbiddenException)
		})

		it('should patch the library successfully', async () => {
			jest.spyOn(libraryRepositoryMock, 'getById').mockImplementationOnce(
				() => Promise.resolve(mockedLib),
			)

			const patchedLibrary: ILibrary = {
				_id: mockedLib._id,
				bookId: mockedLib.bookId.toString(),
				userId: mockedLib.userId.toString(),
				location: mockedLib.location,
				status: LibraryStatus.TO_GIVE,
				place: mockedLib.place,
			}

			jest.spyOn(libraryRepositoryMock, 'update').mockImplementationOnce(
				() => Promise.resolve(patchedLibrary),
			)

			const result = await patchUseCase.handler(
				mockedLib.userId.toString(),
				'libraryId',
				LibraryStatus.TO_GIVE,
			)

			expect(libraryRepositoryMock.update).toHaveBeenCalledWith(
				'libraryId',
				LibraryStatus.TO_GIVE,
			)

			expect(result).toEqual(patchedLibrary)
		})
	})
})
