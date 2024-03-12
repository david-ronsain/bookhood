/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { BookController } from '../../../../src/app/application/controllers/book.controller'
import AddBookUseCase from '../../../../src/app/application/usecases/book/addBook.usecase'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import { ConflictException, HttpStatus } from '@nestjs/common'
import BookModel from '../../../../src/app/domain/models/book.model'
import CreateBookIfNewUseCase from '../../../../src/app/application/usecases/book/createBookIfNew.usecase'
import SearchBookUseCase from '../../../../src/app/application/usecases/book/searchBook.usecase'
import {
	IAddBookDTO,
	IBook,
	IBookSearch,
	ILibraryFull,
	LibraryStatus,
	Role,
} from '../../../../../shared/src'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import GetUserBooksUseCase from '../../../../src/app/application/usecases/book/getUserBooks.usecase'
import { CurrentUser, HealthCheckStatus } from '../../../../../shared-api/src'

describe('BookController', () => {
	let controller: BookController
	let createBookIfNewUseCase: CreateBookIfNewUseCase
	let addBookUseCase: AddBookUseCase
	let searchBookUseCase: SearchBookUseCase
	let getUserBooksUseCase: GetUserBooksUseCase

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}
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
					provide: CreateBookIfNewUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: AddBookUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: GetUserBooksUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: SearchBookUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
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
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('health', () => {
		it('should return "up"', () => {
			const result = controller.health()
			expect(result).toBe(HealthCheckStatus.UP)
		})
	})

	describe('addBook', () => {
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
		const body = {
			book: mockDTO,
			user: currentUser,
		}
		it('should add a book and return success', async () => {
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
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			} as BookModel

			jest.spyOn(createBookIfNewUseCase, 'handler').mockResolvedValue(
				mockBook,
			)

			jest.spyOn(addBookUseCase, 'handler').mockResolvedValue(undefined)

			const result = await controller.addBook(body)

			expect(createBookIfNewUseCase.handler).toHaveBeenCalled()

			expect(addBookUseCase.handler).toHaveBeenCalledWith(
				mockBook._id,
				currentUser._id,
				body.book.location,
				body.book.status,
				body.book.place,
			)
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBook>(
					true,
					HttpStatus.CREATED,
					undefined,
					mockBook,
				),
			)
		})

		it('should handle errors during book creation', async () => {
			jest.spyOn(createBookIfNewUseCase, 'handler').mockRejectedValue(
				new Error('Test error'),
			)

			const result = await controller.addBook({
				user: currentUser,
				book: mockDTO,
			})

			expect(createBookIfNewUseCase.handler).toHaveBeenCalled()
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IAddBookDTO>().buildFromException(
					new Error('Test error'),
					body,
				),
			)
		})

		it('should handle errors during book addition', async () => {
			jest.spyOn(createBookIfNewUseCase, 'handler').mockResolvedValue(
				new BookModel({
					...body.book,
					_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				}),
			)

			jest.spyOn(addBookUseCase, 'handler').mockRejectedValueOnce(
				new ConflictException(),
			)

			const result = await controller.addBook({
				user: currentUser,
				book: body.book,
			})

			expect(createBookIfNewUseCase.handler).toHaveBeenCalled()
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IAddBookDTO>().buildFromException(
					new ConflictException(),
					body,
				),
			)
		})
	})

	describe('searchBook', () => {
		const body = {
			search: 'query',
			startAt: 0,
			language: 'en',
			boundingBox: [0, 0, 0, 0],
			user: currentUser,
		}

		it('should search for books and return success', async () => {
			const mockBookSearch: IBookSearch = {
				results: [],
				total: 0,
			}

			jest.spyOn(searchBookUseCase, 'handler').mockResolvedValue(
				mockBookSearch,
			)
			const result = await controller.searchBook(body)

			expect(searchBookUseCase.handler).toHaveBeenCalledWith(
				body.search,
				body.startAt,
				body.language,
				body.boundingBox,
				body.user.email,
			)

			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBookSearch>(
					true,
					HttpStatus.OK,
					undefined,
					mockBookSearch,
				),
			)
		})

		it('should handle errors during book search', async () => {
			jest.spyOn(searchBookUseCase, 'handler').mockRejectedValue(
				new Error('Test error'),
			)

			const result = await controller.searchBook(body)

			expect(searchBookUseCase.handler).toHaveBeenCalled()
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBookSearch>().buildFromException(
					new Error('Test error'),
					body,
				),
			)
		})
	})

	describe('getUserBooks', () => {
		it('should return user books when token is valid', async () => {
			const body = { user: currentUser, page: 1 }

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

			expect(getUserBooksUseCase.handler).toHaveBeenCalledWith(
				expect.anything(),
				body.page,
			)
		})

		it('should throw an error', async () => {
			const body = { user: currentUser, page: 1 }
			const error = new Error()

			jest.spyOn(getUserBooksUseCase, 'handler').mockRejectedValueOnce(
				error,
			)

			const result = await controller.getUserBooks(body)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					error,
					body,
				),
			)
		})
	})
})
