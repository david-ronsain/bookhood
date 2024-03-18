/* eslint-disable @nx/enforce-module-boundaries */
import CreateBookIfNewUseCase from '../../../../../src/app/application/usecases/book/createBookIfNew.usecase'
import { BookRepository } from '../../../../../src/app/domain/ports/book.repository'
import { IAddBookDTO, IBook, LibraryStatus } from '../../../../../../shared/src'
import BookModel from '../../../../../src/app/domain/models/book.model'
import { bookRepository, addBookDTO } from '../../../../../../shared-api/test'

describe('CreateBookIfNewUseCase', () => {
	let createBookIfNewUseCase: CreateBookIfNewUseCase
	let bookRepositoryMock: BookRepository

	beforeEach(() => {
		jest.clearAllMocks()
		bookRepositoryMock = { ...bookRepository }
		createBookIfNewUseCase = new CreateBookIfNewUseCase(bookRepositoryMock)
	})

	it('should create a new book if it does not exist', async () => {
		jest.spyOn(bookRepositoryMock, 'getByISBN').mockResolvedValue(null)

		const createdBookModel: BookModel = {
			...addBookDTO,
			_id: '123',
		}

		jest.spyOn(bookRepositoryMock, 'create').mockResolvedValue(
			createdBookModel,
		)

		const result = await createBookIfNewUseCase.handler(addBookDTO)

		expect(bookRepositoryMock.getByISBN).toHaveBeenCalledWith([
			addBookDTO.isbn[0].identifier,
		])

		expect(bookRepositoryMock.create).toHaveBeenCalledWith(
			new BookModel(addBookDTO),
		)

		const expectedOutput: IBook = createdBookModel
		expect(result).toEqual(expectedOutput)
	})

	it('should return existing book if it already exists', async () => {
		const existingBookModel: BookModel = {
			...addBookDTO,
			_id: '456',
		}
		jest.spyOn(bookRepositoryMock, 'getByISBN').mockResolvedValue(
			existingBookModel,
		)

		const result = await createBookIfNewUseCase.handler(addBookDTO)

		expect(bookRepositoryMock.getByISBN).toHaveBeenCalledWith([
			addBookDTO.isbn[0].identifier,
		])

		expect(bookRepositoryMock.create).not.toHaveBeenCalled()

		const expectedOutput: IBook = existingBookModel
		expect(result).toEqual(expectedOutput)
	})
})
