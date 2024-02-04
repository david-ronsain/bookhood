/* eslint-disable @nx/enforce-module-boundaries */
import { ConflictException } from '@nestjs/common'
import CreateBookIfNewUseCase from '../../../../src/app/application/usecases/createBookIfNew.usecase'
import { BookRepository } from '../../../../src/app/domain/ports/book.repository'
import { IAddBookDTO, IBook, IISBN } from '../../../../../shared/src'
import BookModel from '../../../../src/app/domain/models/book.model'

describe('CreateBookIfNewUseCase', () => {
	let createBookIfNewUseCase: CreateBookIfNewUseCase
	let bookRepositoryMock: BookRepository

	beforeEach(() => {
		bookRepositoryMock = {
			getByISBN: jest.fn(),
			search: jest.fn(),
			create: jest.fn(),
		}

		createBookIfNewUseCase = new CreateBookIfNewUseCase(bookRepositoryMock)
	})

	it('should create a new book if it does not exist', async () => {
		const addBookDTO: IAddBookDTO = {
			authors: ['author'],
			description: 'desc',
			isbn: [
				{
					type: 'ISBN_13',
					identifier: '01234567890123',
				},
			],
			language: 'fr',
			title: 'title',
			categories: ['category'],
			image: { smallThumbnail: '', thumbnail: '' },
			publishedDate: '2024',
			publisher: 'publisher',
			subtitle: 'subtitle',
			location: { lat: 0, lng: 0 },
		}

		jest.spyOn(bookRepositoryMock, 'getByISBN').mockResolvedValue(null)

		const createdBookModel: BookModel = {
			_id: '123',
			...addBookDTO,
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
		const addBookDTO: IAddBookDTO = {
			authors: ['author'],
			description: 'desc',
			isbn: [
				{
					type: 'ISBN_13',
					identifier: '01234567890123',
				},
			],
			language: 'fr',
			title: 'title',
			categories: ['category'],
			image: { smallThumbnail: '', thumbnail: '' },
			publishedDate: '2024',
			publisher: 'publisher',
			subtitle: 'subtitle',
			location: { lat: 0, lng: 0 },
		}

		const existingBookModel: BookModel = {
			_id: '456',
			...addBookDTO,
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
