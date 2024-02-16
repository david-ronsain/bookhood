/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { BookController } from '../../../../src/app/application/controllers/book.controller'
import AddBookUseCase from '../../../../src/app/application/usecases/book/addBook.usecase'
import { ClientProxy } from '@nestjs/microservices'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import BookModel from '../../../../src/app/domain/models/book.model'
import CreateBookIfNewUseCase from '../../../../src/app/application/usecases/book/createBookIfNew.usecase'
import SearchBookUseCase from '../../../../src/app/application/usecases/book/searchBook.usecase'
import { of, Observable } from 'rxjs'
import {
	IAddBookDTO,
	IBook,
	IBookSearch,
	ILibraryFull,
	ILibraryLocation,
	IUser,
	LibraryStatus,
} from '../../../../../shared/src'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import GetUserBooksUseCase from '../../../../src/app/application/usecases/book/getUserBooks.usecase'

describe('BookController', () => {
	let controller: BookController
	let createBookIfNewUseCase: CreateBookIfNewUseCase
	let addBookUseCase: AddBookUseCase
	let searchBookUseCase: SearchBookUseCase
	let getUserBooksUseCase: GetUserBooksUseCase
	let userClient: ClientProxy
	let mailClient: ClientProxy

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BookController],
			providers: [
				{
					provide: CreateBookIfNewUseCase,
					useValue: { handler: jest.fn() },
				},
				{ provide: AddBookUseCase, useValue: { handler: jest.fn() } },
				{
					provide: GetUserBooksUseCase,
					useValue: { handler: jest.fn() },
				},
				{
					provide: SearchBookUseCase,
					useValue: { handler: jest.fn() },
				},
				{
					provide: SearchBookUseCase,
					useValue: { handler: jest.fn() },
				},
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
				{ provide: 'RabbitMail', useValue: { send: jest.fn() } },
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: mockLogger,
				},
			],
		}).compile()

		controller = module.get<BookController>(BookController)
		createBookIfNewUseCase = module.get<CreateBookIfNewUseCase>(
			CreateBookIfNewUseCase,
		)
		addBookUseCase = module.get<AddBookUseCase>(AddBookUseCase)
		searchBookUseCase = module.get<SearchBookUseCase>(SearchBookUseCase)
		getUserBooksUseCase =
			module.get<GetUserBooksUseCase>(GetUserBooksUseCase)
		userClient = module.get<ClientProxy>('RabbitUser')
		mailClient = module.get<ClientProxy>('RabbitMail')
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('health', () => {
		it('should return "up"', () => {
			const result = controller.health()
			expect(result).toBe('up')
		})
	})

	describe('addBook', () => {
		it('should add a book and return success', async () => {
			const mockDTO: IAddBookDTO = {
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
				location: {
					lat: 0,
					lng: 0,
				},
				status: LibraryStatus.TO_LEND,
				place: 'Some place',
			} as IAddBookDTO
			const mockBook: BookModel = {
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
				status: LibraryStatus.TO_LEND,
				place: 'Some place',
			} as BookModel
			const mockToken = 'mockToken||'

			jest.spyOn(createBookIfNewUseCase, 'handler').mockResolvedValue(
				mockBook,
			)
			jest.spyOn(userClient, 'send').mockReturnValue(
				of({ success: true, data: { _id: 'mockUserId' } }),
			)
			jest.spyOn(addBookUseCase, 'handler').mockResolvedValue(undefined)

			const result = await controller.addBook({
				token: mockToken,
				data: { book: mockDTO },
			})

			expect(createBookIfNewUseCase.handler).toHaveBeenCalled()
			expect(userClient.send).toHaveBeenCalledWith(
				'user-get-by-token',
				'mockToken|',
			)
			expect(addBookUseCase.handler).toHaveBeenCalledWith(
				mockBook._id,
				'mockUserId',
				{ lat: 0, lng: 0 },
				mockDTO.status,
				mockDTO.place,
			)
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBook>(
					true,
					HttpStatus.CREATED,
					undefined,
					mockBook,
				),
			)

			await controller.addBook({
				token: undefined,
				data: { book: mockDTO },
			})

			expect(userClient.send).toHaveBeenCalledWith(
				'user-get-by-token',
				'',
			)
		})

		it('should handle errors during book addition', async () => {
			const book = {
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
			} as IAddBookDTO
			jest.spyOn(createBookIfNewUseCase, 'handler').mockRejectedValue(
				new Error('Test error'),
			)

			const result = await controller.addBook({
				token: 'mockToken',
				data: {
					book,
				},
			})

			expect(createBookIfNewUseCase.handler).toHaveBeenCalled()
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IAddBookDTO>().buildFromException(
					new Error('Test error'),
					book,
				),
			)
		})
	})

	describe('searchBook', () => {
		it('should search for books and return success', async () => {
			const mockBookSearch: IBookSearch = {
				results: [],
				total: 0,
			}

			jest.spyOn(searchBookUseCase, 'handler').mockResolvedValue(
				mockBookSearch,
			)

			const result = await controller.searchBook({
				search: 'query',
				startAt: 0,
				language: 'en',
				boundingBox: [0, 0, 0, 0],
				token:
					Buffer.from('first.last@name.test').toString('base64') +
					'||',
			})

			expect(searchBookUseCase.handler).toHaveBeenCalledWith(
				'query',
				0,
				'en',
				[0, 0, 0, 0],
				'first.last@name.test',
			)
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBookSearch>(
					true,
					HttpStatus.CREATED,
					undefined,
					mockBookSearch,
				),
			)

			await controller.searchBook({
				search: 'query',
				startAt: 0,
				language: 'en',
				boundingBox: [0, 0, 0, 0],
				token: undefined,
			})

			expect(searchBookUseCase.handler).toHaveBeenCalledWith(
				'query',
				0,
				'en',
				[0, 0, 0, 0],
				undefined,
			)
		})

		it('should handle errors during book search', async () => {
			jest.spyOn(searchBookUseCase, 'handler').mockRejectedValue(
				new Error('Test error'),
			)

			const result = await controller.searchBook({
				search: 'query',
				startAt: 0,
				language: 'en',
				boundingBox: [0, 0, 0, 0],
			})

			expect(searchBookUseCase.handler).toHaveBeenCalled()
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBookSearch>().buildFromException(
					new Error('Test error'),
					{
						search: 'query',
						startAt: 0,
						language: 'en',
						boundingBox: [0, 0, 0, 0],
					},
				),
			)
		})
	})

	describe('getUserBooks', () => {
		it('should return user books when token is valid', async () => {
			const body = { token: 'mockToken', page: 1 }
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					true,
					200,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)
			const mockUserBooks: ILibraryFull[] = [
				{
					_id: '123',
					book: {
						title: 'Title',
						authors: ['author'],
						description: 'desc',
						isbn: [
							{ type: 'ISBN_13', identifier: '1234567890123' },
						],
						language: 'fr',
					},
					location: {
						type: 'Point',
						coordinates: [0, 0],
					},
					user: {
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				},
			]
			jest.spyOn(getUserBooksUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(mockUserBooks),
			)

			const result = await controller.getUserBooks(body)

			expect(result).toEqual(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					undefined,
					mockUserBooks,
				),
			)
			expect(userClient.send).toHaveBeenCalledWith(
				'user-get-by-token',
				'mockToken',
			)
			expect(getUserBooksUseCase.handler).toHaveBeenCalledWith(
				expect.anything(),
				body.page,
			)
		})

		it('should return an error response if token is invalid', async () => {
			const body = { token: 'mockToken', page: 1 }
			const error = new ForbiddenException()
			const mockObservable: Observable<any> = of(
				new MicroserviceResponseFormatter(
					false,
					200,
					{},
					{
						_id: 'mockUserId',
						firstName: 'first',
						lastName: 'last',
						email: 'first.last@name.test',
					},
				),
			)
			jest.spyOn(userClient, 'send').mockReturnValue(mockObservable)

			const result = await controller.getUserBooks(body)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					error,
					body,
				),
			)
			expect(userClient.send).toHaveBeenCalledWith(
				'user-get-by-token',
				'mockToken',
			)
		})
	})
})
