/* eslint-disable @nx/enforce-module-boundaries */
import { Model, Query } from 'mongoose'
import BookRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/book.repository.mongo'
import { BookEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/book.entity'
import BookModel from '../../../../../src/app/domain/models/book.model'
import {
	IBookSearch,
	IBookSearchResultOwner,
} from '../../../../../../shared/src'
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'

describe('BookRepositoryMongo', () => {
	let bookRepository: BookRepositoryMongo
	let bookModel: Model<BookEntity>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BookRepositoryMongo,
				{
					provide: getModelToken('Book'),
					useValue: {
						findOne: jest.fn(),
						create: jest.fn(),
						aggregate: jest.fn(),
					},
				},
			],
		}).compile()

		bookRepository = module.get<BookRepositoryMongo>(BookRepositoryMongo)
		bookModel = module.get<Model<BookEntity>>(getModelToken('Book'))
	})

	describe('getByISBN', () => {
		it('should return a BookModel if book is found', async () => {
			const findOneMock = jest.fn().mockReturnValue({
				_id: '123',
				title: 'Example Book',
				authors: ['John Doe'],
				categories: ['Fiction'],
				description: 'A sample book description.',
				image: {
					thumbnail: 'thumbnail-url',
					smallThumbnail: 'small-thumbnail-url',
				},
				isbn: [
					{
						type: 'ISBN_13',
						identifier: '9781234567890',
					},
				],
				language: 'en',
				subtitle: 'An amazing story',
				publisher: 'Book Publisher',
				publishedDate: '2022-01-01',
			})
			jest.spyOn(bookModel, 'findOne').mockImplementationOnce(findOneMock)

			const result = await bookRepository.getByISBN(['9781234567890'])

			expect(result).toBeInstanceOf(BookModel)
		})

		it('should return null if book is not found', async () => {
			jest.spyOn(bookModel, 'findOne').mockImplementationOnce(
				() =>
					null as unknown as Query<
						unknown,
						unknown,
						object,
						BookEntity,
						'findOne'
					>
			)

			const result = await bookRepository.getByISBN(['isbn'])

			expect(result).toBeNull()
		})
	})

	describe('create', () => {
		it('should return a created BookModel', async () => {
			const bookEntity = {
				_id: '123',
				title: 'Example Book',
				authors: ['John Doe'],
				categories: ['Fiction'],
				description: 'A sample book description.',
				image: {
					thumbnail: 'thumbnail-url',
					smallThumbnail: 'small-thumbnail-url',
				},
				isbn: [
					{
						type: 'ISBN_13',
						identifier: '9781234567890',
					},
				],
				language: 'en',
				subtitle: 'An amazing story',
				publisher: 'Book Publisher',
				publishedDate: '2022-01-01',
			} as BookEntity
			const createMock = jest.fn().mockReturnValue(bookEntity)
			jest.spyOn(bookModel, 'create').mockImplementationOnce(createMock)

			const book = new BookModel(bookEntity)
			const result = await bookRepository.create(book)

			expect(result).toBeInstanceOf(BookModel)
		})
	})

	describe('search', () => {
		it('should return a valid IBookSearch for a title', async () => {
			const mockedResult: IBookSearch = {
				results: [
					{
						_id: '123',
						title: 'Example Book',
						authors: ['John Doe'],
						description: 'desc',
						language: 'en',
						isbn: [],
						owner: undefined as unknown as IBookSearchResultOwner,
					},
					{
						_id: '456',
						title: 'Another Book',
						authors: ['Jane Doe'],
						description: 'desc',
						language: 'en',
						isbn: [],
						owner: undefined as unknown as IBookSearchResultOwner,
					},
				],
				total: 2,
			}
			const aggregateMock = jest.fn().mockResolvedValue([mockedResult])
			jest.spyOn(bookModel, 'aggregate').mockImplementationOnce(
				aggregateMock
			)

			const result = await bookRepository.search(
				'intitle',
				'book',
				0,
				'en',
				[]
			)

			expect(result).toEqual(mockedResult)
		})

		it('should return a valid IBookSearch for an author', async () => {
			const mockedResult: IBookSearch = {
				results: [
					{
						_id: '123',
						title: 'Example Book',
						authors: ['John Doe'],
						description: 'desc',
						language: 'en',
						isbn: [],
						owner: undefined as unknown as IBookSearchResultOwner,
					},
					{
						_id: '456',
						title: 'Another Book',
						authors: ['Jane Doe'],
						description: 'desc',
						language: 'en',
						isbn: [],
						owner: undefined as unknown as IBookSearchResultOwner,
					},
				],
				total: 2,
			}
			const aggregateMock = jest.fn().mockResolvedValue([mockedResult])
			jest.spyOn(bookModel, 'aggregate').mockImplementationOnce(
				aggregateMock
			)

			const result = await bookRepository.search(
				'inauthor',
				'doe',
				0,
				'en',
				[0, 0, 0, 0]
			)

			expect(result).toEqual(result)
		})
	})
})
