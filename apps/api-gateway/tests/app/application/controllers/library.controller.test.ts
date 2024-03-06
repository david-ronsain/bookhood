/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { LibraryController } from '../../../../src/app/application/controllers/library.controller'
import {
	CurrentUser,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src'
import { of } from 'rxjs'
import {
	IBook,
	IBooksList,
	LibraryStatus,
	Role,
} from '../../../../../shared/src'
import { BookNotFoundException } from '../../../../src/app/application/exceptions'

jest.mock('@nestjs/microservices', () => ({
	ClientProxy: {
		send: jest.fn(() => of({})),
	},
}))

describe('LibraryController', () => {
	let controller: LibraryController

	const currentUser: CurrentUser = {
		_id: 'userId',
		token: 'token',
		email: 'first.last@name.test',
		roles: [Role.ADMIN],
		firstName: 'first',
	}

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
				{
					provide: 'RabbitUser',
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
		const page = 0
		const userId = 'userId'

		it('should get libraries', async () => {
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

			const result = await controller.getLibraries(
				currentUser,
				userId,
				page,
			)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'libraries-list',
				{
					userId,
					page,
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
				controller.getLibraries(currentUser, userId, page),
			).rejects.toThrow(HttpException)
		})
	})

	describe('patch', () => {
		const status = LibraryStatus.TO_LEND
		const libraryId = 'libId'

		it('should update the library', async () => {
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

			const result = await controller.patch(
				currentUser,
				libraryId,
				status,
			)

			expect(controller['bookQueue'].send).toHaveBeenCalledWith(
				'library-patch',
				{
					libraryId,
					status,
					user: currentUser,
				},
			)
			expect(result).toEqual(response.data)
		})

		it('should throw an error', async () => {
			const response = new MicroserviceResponseFormatter(false)

			jest.spyOn(controller['bookQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.patch(currentUser, libraryId, status),
			).rejects.toThrow(BookNotFoundException)
		})
	})
})
