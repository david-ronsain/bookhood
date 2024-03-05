/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { LibraryController } from '../../../../src/app/application/controllers/library.controller'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import { of } from 'rxjs'
import { IBook, IBooksList, LibraryStatus } from '../../../../../shared/src'
import { BookNotFoundException } from '../../../../src/app/application/exceptions'

jest.mock('@nestjs/microservices', () => ({
	ClientProxy: {
		send: jest.fn(() => of({})),
	},
}))

describe('LibraryController', () => {
	let controller: LibraryController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LibraryController],
			providers: [
				{
					provide: 'RabbitBook',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
			],
		}).compile()

		controller = module.get<LibraryController>(LibraryController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('getLibraries', () => {
		it('should get libraries', async () => {
			const page = 0
			const token = 'token'
			const userId = 'userId'

			const response = new MicroserviceResponseFormatter<IBooksList>(
				true,
				HttpStatus.OK,
				{},
				{
					total: 1,
					results: [
						{
							_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
							title: 'title',
							authors: ['author'],
							description: 'description',
							place: 'place',
							status: LibraryStatus.TO_LEND,
							categories: ['category'],
						},
					],
				},
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getLibraries(token, userId, page)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'libraries-list',
				{
					token,
					userId,
					page,
				},
			)
			expect(result).toEqual(response.data)
		})

		it('should handle generic HTTP exception', async () => {
			const page = 0
			const token = 'token'
			const userId = 'userId'

			const response = new MicroserviceResponseFormatter(false)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.getLibraries(token, userId, page),
			).rejects.toThrow(HttpException)
		})
	})

	describe('patch', () => {
		it('should update the library', async () => {
			const status = LibraryStatus.TO_LEND
			const token = 'token'
			const libraryId = 'libId'

			const response = new MicroserviceResponseFormatter<IBook>(
				true,
				HttpStatus.OK,
				{},
				{
					_id: libraryId,
					title: 'title',
					authors: ['author'],
					categories: ['category'],
					description: 'description',
					isbn: [],
					language: 'fr',
					status,
				},
			)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.patch(token, libraryId, status)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'library-patch',
				{
					token,
					libraryId,
					status,
				},
			)
			expect(result).toEqual(response.data)
		})

		it('should throw an error', async () => {
			const status = LibraryStatus.TO_LEND
			const token = 'token'
			const libraryId = 'userId'

			const response = new MicroserviceResponseFormatter(false)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.patch(token, libraryId, status),
			).rejects.toThrow(BookNotFoundException)
		})
	})
})
