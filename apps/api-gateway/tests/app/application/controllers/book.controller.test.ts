/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { BookController } from '../../../../src/app/application/controllers/book.controller'
import { AddBookDTO } from '../../../../src/app/application/dto/book.dto'
import {
	CurrentUser,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src'
import { of } from 'rxjs'
import { LibraryStatus, Role } from '../../../../../shared/src'

jest.mock('@nestjs/microservices', () => ({
	ClientProxy: {
		send: jest.fn(() => of({})),
	},
}))

jest.mock('googleapis', () => ({
	google: {
		books: jest.fn(() => ({
			volumes: {
				list: jest.fn(() => Promise.resolve({ data: {} })),
			},
		})),
	},
}))

describe('BookController', () => {
	let controller: BookController

	const currentUser: CurrentUser = {
		_id: 'userId',
		token: 'token',
		email: 'first.last@name.test',
		roles: [Role.ADMIN],
		firstName: 'first',
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookController],
			providers: [
				{
					provide: 'RabbitBook',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
				{
					provide: 'RabbitUser',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
			],
		}).compile()

		controller = module.get<BookController>(BookController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('addBook', () => {
		it('should add a new book to the library', async () => {
			const addBookDTO: AddBookDTO = {
				authors: ['author'],
				title: 'title',
				categories: ['category'],
				description: 'description',
				isbn: [{ type: 'ISBN_13', identifier: '1234567890123' }],
				language: 'fr',
				subtitle: 'subtitle',
				publisher: 'publisher',
				publishedDate: '2023',
				location: { lat: 0, lng: 0 },
				status: LibraryStatus.TO_LEND,
				place: 'Some place',
			}

			const response = new MicroserviceResponseFormatter(
				true,
				HttpStatus.CREATED,
				addBookDTO,
				addBookDTO,
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.addBook(currentUser, addBookDTO)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'book-add',
				{
					user: currentUser,
					book: addBookDTO,
				},
			)
			expect(result).toEqual(response.data)
		})

		it('should handle generic HTTP exception', async () => {
			const addBookDTO: AddBookDTO = {
				title: '',
				authors: [],
				categories: [],
				description: '',
				isbn: [],
				language: '',
				subtitle: '',
				publisher: '',
				publishedDate: '',
				location: { lat: 0, lng: 0 },
				status: LibraryStatus.TO_LEND,
				place: 'Some place',
			}

			const response = new MicroserviceResponseFormatter(false)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.addBook(currentUser, addBookDTO),
			).rejects.toThrow(HttpException)
		})
	})

	describe('getGoogleBookByISBN', () => {
		it('should get a Google book by ISBN', async () => {
			const isbn = 'fakeISBN'

			const result = await controller.getGoogleBookByISBN(isbn)

			expect(result).toEqual({})
		})
	})

	describe('getGoogleBooks', () => {
		it('should get Google books', async () => {
			const q = 'fakeQuery'
			const startAt = 0

			const result = await controller.getGoogleBooks(q, startAt)

			expect(result).toEqual({})
		})
	})

	describe('getBooks', () => {
		const q = 'fakeQuery'
		const startIndex = 0
		const boundingBox = [0, 0, 0, 0]

		it('should get books', async () => {
			const response = new MicroserviceResponseFormatter(
				true,
				HttpStatus.OK,
				{},
				{},
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getBooks(currentUser, {
				q,
				startIndex,
				boundingBox,
			})

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'book-search',
				{
					search: q,
					startAt: startIndex,
					language: 'fr',
					boundingBox,
					user: currentUser,
				},
			)
			expect(result).toEqual(response.data)
		})

		it('should handle generic HTTP exception', async () => {
			const response = new MicroserviceResponseFormatter(false)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.getBooks(currentUser, {
					q,
					startIndex,
					boundingBox,
				}),
			).rejects.toThrow(HttpException)
		})
	})

	describe('getUserBooks', () => {
		it('should get books', async () => {
			const page = 0
			const token = 'token'

			const response = new MicroserviceResponseFormatter(
				true,
				HttpStatus.OK,
				{},
				[
					{
						_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
						book: {
							title: 'title',
							authors: ['author'],
							isbn: [
								{
									type: 'ISBN_13',
									identifier: '1234567890123',
								},
							],
							language: 'fr',
						},
						location: {
							type: 'Point',
							coordinates: [0, 0],
						},
						user: {
							_id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
							firstName: 'first',
							lastName: 'last',
							email: 'first.last@name.test',
						},
					},
				],
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getUserBooks(currentUser, page)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'book-get',
				{
					page,
					user: currentUser,
				},
			)
			expect(result).toEqual(response.data)
		})

		it('should handle generic HTTP exception', async () => {
			const page = 0

			const response = new MicroserviceResponseFormatter(false)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.getUserBooks(currentUser, page),
			).rejects.toThrow(HttpException)
		})
	})
})
