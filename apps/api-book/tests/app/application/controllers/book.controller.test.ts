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
	Locale,
} from '../../../../../shared/src'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import GetUserBooksUseCase from '../../../../src/app/application/usecases/book/getUserBooks.usecase'
import { GetStatsMQDTO, HealthCheckStatus } from '../../../../../shared-api/src'
import GetUserLibraryStatsUseCase from '../../../../src/app/application/usecases/library/getUserLibraryStats.usecase'
import GetUserRequestStatsUseCase from '../../../../src/app/application/usecases/request/getUserRequestStats.usecase'
import {
	addBookDTO,
	bookModel,
	currentUser,
	emptyBookSearch,
	librariesFull,
	userLibraryStats,
} from '../../../../../shared-api/test'
import { userRequestStats } from '../../../../../shared-api/test/data/books/request'
import { I18nService } from 'nestjs-i18n'
import envConfig from '../../../../../api-conversation/src/config/env.config'
import { ConfigModule } from '@nestjs/config'

describe('BookController', () => {
	let controller: BookController
	let createBookIfNewUseCase: CreateBookIfNewUseCase
	let addBookUseCase: AddBookUseCase
	let searchBookUseCase: SearchBookUseCase
	let getUserBooksUseCase: GetUserBooksUseCase
	let getUserLibraryStatsUseCase: GetUserLibraryStatsUseCase
	let getUserRequestStatsUseCase: GetUserRequestStatsUseCase

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [envConfig],
				}),
			],
			controllers: [BookController],
			providers: [
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
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
					provide: GetUserLibraryStatsUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: GetUserRequestStatsUseCase,
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
				{
					provide: I18nService,
					useValue: {
						t: jest.fn(),
					},
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
		getUserLibraryStatsUseCase = module.get<GetUserLibraryStatsUseCase>(
			GetUserLibraryStatsUseCase,
		)
		getUserRequestStatsUseCase = module.get<GetUserRequestStatsUseCase>(
			GetUserRequestStatsUseCase,
		)
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
		const mockDTO = addBookDTO
		const body = {
			book: mockDTO,
			user: currentUser,
			session: {
				locale: Locale.FR,
			},
		}
		it('should add a book and return success', async () => {
			const mockBook = bookModel as BookModel

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

			const result = await controller.addBook(body)

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
				session: {
					locale: Locale.FR,
				},
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
			locale: Locale.FR,
		}

		it('should search for books and return success', async () => {
			const mockBookSearch = emptyBookSearch

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
		const body = { user: currentUser, page: 1, locale: Locale.FR }

		it('should return user books when token is valid', async () => {
			const mockUserBooks = librariesFull
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

	describe('getUserBooksStats', () => {
		const dto: GetStatsMQDTO = {
			userId: 'userId',
			session: {
				token: 'token',
				locale: Locale.FR,
			},
		}
		const libStats = userLibraryStats
		const reqStats = userRequestStats

		it('should return user books when token is valid', async () => {
			jest.spyOn(getUserLibraryStatsUseCase, 'handler').mockResolvedValue(
				libStats,
			)
			jest.spyOn(getUserRequestStatsUseCase, 'handler').mockResolvedValue(
				reqStats,
			)

			const result = await controller.getUserBooksStats(dto)

			expect(result).toEqual(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					undefined,
					{
						...libStats,
						...reqStats,
					},
				),
			)

			expect(getUserLibraryStatsUseCase.handler).toHaveBeenCalledWith(
				dto.userId,
			)
			expect(getUserRequestStatsUseCase.handler).toHaveBeenCalledWith(
				dto.userId,
			)
		})

		it('should throw an error', async () => {
			const error = new Error()

			jest.spyOn(
				getUserLibraryStatsUseCase,
				'handler',
			).mockRejectedValueOnce(error)
			jest.spyOn(
				getUserRequestStatsUseCase,
				'handler',
			).mockResolvedValueOnce(reqStats)

			const result = await controller.getUserBooksStats(dto)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(error, {
					userId: dto.userId,
				}),
			)
		})

		it('should throw an error', async () => {
			const error = new Error()

			jest.spyOn(
				getUserLibraryStatsUseCase,
				'handler',
			).mockResolvedValueOnce(libStats)
			jest.spyOn(
				getUserRequestStatsUseCase,
				'handler',
			).mockRejectedValueOnce(error)

			const result = await controller.getUserBooksStats(dto)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(error, {
					userId: dto.userId,
				}),
			)
		})
	})
})
