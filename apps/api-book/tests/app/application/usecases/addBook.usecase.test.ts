import { ConflictException } from '@nestjs/common'
import AddBookUseCase from '../../../../src/app/application/usecases/addBook.usecase'
import { LibraryRepository } from '../../../../src/app/domain/ports/library.repository'
import LibraryModel from '../../../../src/app/domain/models/library.model'
import LibraryMapper from '../../../../src/app/application/mappers/library.mapper'
import mongoose from 'mongoose'

describe('AddBookUseCase', () => {
	let addBookUseCase: AddBookUseCase
	let libraryRepositoryMock: LibraryRepository

	beforeEach(() => {
		libraryRepositoryMock = {
			getByUserIdAndBookId: jest.fn(),
			create: jest.fn(),
		}

		addBookUseCase = new AddBookUseCase(libraryRepositoryMock)
	})

	it('should add a book to the library successfully', async () => {
		const bookId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
		const userId = 'bbbbbbbbbbbbbbbbbbbbbbbb'

		jest.spyOn(
			libraryRepositoryMock,
			'getByUserIdAndBookId',
		).mockResolvedValue(null)

		const createdLibraryModel: LibraryModel = {
			_id: '789',
			bookId: new mongoose.Types.ObjectId(bookId),
			userId: new mongoose.Types.ObjectId(userId),
			location: { type: 'Point', coordinates: [0, 0] },
		}

		jest.spyOn(libraryRepositoryMock, 'create').mockResolvedValue(
			createdLibraryModel,
		)

		const result = await addBookUseCase.handler(bookId, userId, {
			lat: 0,
			lng: 0,
		})

		expect(libraryRepositoryMock.create).toHaveBeenCalledWith(
			new LibraryModel({
				bookId,
				userId,
				location: { type: 'Point', coordinates: [0, 0] },
			}),
		)

		const expectedOutput =
			LibraryMapper.modelObjectIdToString(createdLibraryModel)
		expect(result).toEqual(expectedOutput)
	})

	it('should throw a ConflictException when the book already exists in the library', async () => {
		const bookId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
		const userId = 'bbbbbbbbbbbbbbbbbbbbbbbb'

		jest.spyOn(
			libraryRepositoryMock,
			'getByUserIdAndBookId',
		).mockResolvedValue({
			_id: '789',
			bookId: new mongoose.Types.ObjectId(bookId),
			userId: new mongoose.Types.ObjectId(userId),
			location: { type: 'Point', coordinates: [0, 0] },
		})

		await expect(
			addBookUseCase.handler(bookId, userId, { lat: 0, lng: 0 }),
		).rejects.toThrow(ConflictException)

		expect(libraryRepositoryMock.getByUserIdAndBookId).toHaveBeenCalledWith(
			userId,
			bookId,
		)

		expect(libraryRepositoryMock.create).not.toHaveBeenCalled()
	})
})
