/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { BookController } from '../../../../src/app/application/controllers/book.controller'
import AddBookUseCase from '../../../../src/app/application/usecases/addBook.usecase'
import { ClientProxy } from '@nestjs/microservices'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import { HttpStatus } from '@nestjs/common'
import BookModel from '../../../../src/app/domain/models/book.model'
import CreateBookIfNewUseCase from '../../../../src/app/application/usecases/createBookIfNew.usecase'
import SearchBookUseCase from '../../../../src/app/application/usecases/searchBook.usecase'
import { of } from 'rxjs'
import { IAddBookDTO, IBookSearch } from '../../../../../shared/src'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

describe('BookController', () => {
	let controller: BookController
	let createBookIfNewUseCase: CreateBookIfNewUseCase
	let addBookUseCase: AddBookUseCase
	let searchBookUseCase: SearchBookUseCase
	let userClient: ClientProxy

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
					provide: SearchBookUseCase,
					useValue: { handler: jest.fn() },
				},
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: mockLogger,
				},
			],
		}).compile()

		controller = module.get<BookController>(BookController)
		createBookIfNewUseCase = module.get<CreateBookIfNewUseCase>(
			CreateBookIfNewUseCase
		)
		addBookUseCase = module.get<AddBookUseCase>(AddBookUseCase)
		searchBookUseCase = module.get<SearchBookUseCase>(SearchBookUseCase)
		userClient = module.get<ClientProxy>('RabbitUser')
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
			} as BookModel
			const mockToken = 'mockToken||'

			jest.spyOn(createBookIfNewUseCase, 'handler').mockResolvedValue(
				mockBook
			)
			jest.spyOn(userClient, 'send').mockReturnValue(
				of({ success: true, data: { _id: 'mockUserId' } })
			)
			jest.spyOn(addBookUseCase, 'handler').mockResolvedValue(undefined)

			const result = await controller.addBook({
				token: mockToken,
				data: { book: mockBook },
			})

			expect(createBookIfNewUseCase.handler).toHaveBeenCalled()
			expect(userClient.send).toHaveBeenCalledWith(
				'user-get-by-token',
				'mockToken|'
			)
			expect(addBookUseCase.handler).toHaveBeenCalledWith(
				mockBook._id,
				'mockUserId'
			)
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IAddBookDTO>(
					true,
					HttpStatus.CREATED,
					undefined,
					mockBook
				)
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
				new Error('Test error')
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
					book
				)
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
				mockBookSearch
			)

			const result = await controller.searchBook({
				search: 'query',
				startAt: 0,
				language: 'en',
				boundingBox: [0, 0, 0, 0],
			})

			expect(searchBookUseCase.handler).toHaveBeenCalled()
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IBookSearch>(
					true,
					HttpStatus.CREATED,
					undefined,
					mockBookSearch
				)
			)
		})

		it('should handle errors during book search', async () => {
			jest.spyOn(searchBookUseCase, 'handler').mockRejectedValue(
				new Error('Test error')
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
					}
				)
			)
		})
	})
})
