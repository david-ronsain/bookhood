/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { BookController } from '../../../../src/app/application/controllers/book.controller'
import { AddBookDTO } from '../../../../src/app/application/dto/book.dto'
import {
	MQBookMessageType,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src'
import { of } from 'rxjs'
import {
	addBookDTO,
	currentUser,
	librariesFull,
} from '../../../../../shared-api/test'
import { Locale } from '../../../../../shared/src'
import { I18nService } from 'nestjs-i18n'
import { ConfigModule } from '@nestjs/config'
import envConfig from '../../../../src/config/env.config'

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
				{
					provide: I18nService,
					useValue: {
						t: jest.fn(),
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
			const response = new MicroserviceResponseFormatter(
				true,
				HttpStatus.CREATED,
				addBookDTO,
				addBookDTO,
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.addBook(
				currentUser,
				addBookDTO as unknown as AddBookDTO,
				Locale.FR,
				'',
			)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				MQBookMessageType.CREATE,
				{
					user: currentUser,
					book: addBookDTO,
					session: {
						locale: Locale.FR,
						token: '',
					},
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
				controller.addBook(
					currentUser,
					addBookDTO as unknown as AddBookDTO,
					Locale.FR,
					'',
				),
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

			const result = await controller.getBooks(
				currentUser,
				{
					q,
					startIndex,
					boundingBox,
				},
				Locale.FR,
				'',
			)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				MQBookMessageType.SEARCH,
				{
					search: q,
					startAt: startIndex,
					language: 'fr',
					boundingBox,
					user: currentUser,
					session: {
						locale: Locale.FR,
						token: '',
					},
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
				controller.getBooks(
					currentUser,
					{
						q,
						startIndex,
						boundingBox,
					},
					Locale.FR,
					'',
				),
			).rejects.toThrow(HttpException)
		})
	})

	describe('getUserBooks', () => {
		it('should get books', async () => {
			const page = 0

			const response = new MicroserviceResponseFormatter(
				true,
				HttpStatus.OK,
				{},
				librariesFull,
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getUserBooks(
				currentUser,
				page,
				Locale.FR,
				'',
			)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				MQBookMessageType.GET,
				{
					page,
					user: currentUser,
					session: {
						locale: Locale.FR,
						token: '',
					},
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
				controller.getUserBooks(currentUser, page, Locale.FR, ''),
			).rejects.toThrow(HttpException)
		})
	})
})
