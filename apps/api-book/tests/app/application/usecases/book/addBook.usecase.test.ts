/* eslint-disable @nx/enforce-module-boundaries */
import { ConflictException } from '@nestjs/common'
import AddBookUseCase from '../../../../../src/app/application/usecases/book/addBook.usecase'
import { LibraryRepository } from '../../../../../src/app/domain/ports/library.repository'
import LibraryModel from '../../../../../src/app/domain/models/library.model'
import LibraryMapper from '../../../../../src/app/application/mappers/library.mapper'
import { LibraryStatus } from '../../../../../../shared/src'
import {
	libraryModel,
	libraryRepositoryMock as mockRepo,
} from '../../../../../../shared-api/test'

describe('AddBookUseCase', () => {
	let addBookUseCase: AddBookUseCase
	let libraryRepositoryMock: LibraryRepository

	beforeEach(() => {
		jest.clearAllMocks()
		libraryRepositoryMock = { ...mockRepo }

		addBookUseCase = new AddBookUseCase(libraryRepositoryMock)
	})

	it('should add a book to the library successfully', async () => {
		jest.spyOn(
			libraryRepositoryMock,
			'getByUserIdAndBookId',
		).mockResolvedValue(null)

		jest.spyOn(libraryRepositoryMock, 'create').mockResolvedValue(
			libraryModel,
		)

		const result = await addBookUseCase.handler(
			libraryModel.bookId.toString(),
			libraryModel.userId.toString(),
			{
				lat: 0,
				lng: 0,
			},
			LibraryStatus.TO_LEND,
			'Some place',
		)

		expect(libraryRepositoryMock.create).toHaveBeenCalledWith({
			...libraryModel,
			_id: undefined,
		})

		const expectedOutput = LibraryMapper.modelObjectIdToString(
			libraryModel as unknown as LibraryModel,
		)
		expect(result).toEqual(expectedOutput)
	})

	it('should throw a ConflictException when the book already exists in the library', async () => {
		jest.spyOn(
			libraryRepositoryMock,
			'getByUserIdAndBookId',
		).mockResolvedValue(libraryModel)
		jest.spyOn(libraryRepositoryMock, 'create')

		await expect(
			addBookUseCase.handler(
				libraryModel.bookId.toString(),
				libraryModel.userId.toString(),
				{ lat: 0, lng: 0 },
				LibraryStatus.TO_LEND,
				'Some place',
			),
		).rejects.toThrow(ConflictException)

		expect(libraryRepositoryMock.getByUserIdAndBookId).toHaveBeenCalledWith(
			libraryModel.userId.toString(),
			libraryModel.bookId.toString(),
		)

		expect(libraryRepositoryMock.create).not.toHaveBeenCalled()
	})
})
