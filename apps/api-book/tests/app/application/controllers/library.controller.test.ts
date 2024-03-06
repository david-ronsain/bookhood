/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { LibraryController } from '../../../../src/app/application/controllers/library.controller'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import {
	IBooksList,
	ILibrary,
	LibraryStatus,
	Role,
} from '../../../../../shared/src'
import ListUseCase from '../../../../src/app/application/usecases/library/list.usecase'
import PatchUseCase from '../../../../src/app/application/usecases/library/patch.usecase'
import { CurrentUser } from '../../../../../shared-api/src'

describe('LibraryController', () => {
	let controller: LibraryController
	let listUseCase: ListUseCase
	let patchLibraryUseCase: PatchUseCase

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
					provide: ListUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: PatchUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
			],
		}).compile()

		controller = module.get<LibraryController>(LibraryController)
		listUseCase = module.get<ListUseCase>(ListUseCase)
		patchLibraryUseCase = module.get<PatchUseCase>(PatchUseCase)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('getLibrariesList', () => {
		it('should return profile books when token is valid', async () => {
			const body = { user: currentUser, page: 1, userId: 'aaaaaaaaaaaa' }

			const mockProfileBooks: IBooksList = {
				results: [
					{
						_id: 'aaaaaaaaaaaa',
						authors: ['author'],
						description: 'description',
						place: 'place',
						status: LibraryStatus.TO_LEND,
						title: 'title',
						categories: ['category'],
					},
				],
				total: 1,
			}
			jest.spyOn(listUseCase, 'handler').mockImplementationOnce(() =>
				Promise.resolve(mockProfileBooks),
			)

			const result = await controller.getLibrariesList(body)
			expect(result).toEqual(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					undefined,
					mockProfileBooks,
				),
			)
			expect(listUseCase.handler).toHaveBeenCalledWith(
				body.userId,
				body.page,
			)
		})

		it('should throw an error', async () => {
			const body = {
				user: currentUser,
				page: 1,
				userId: 'aaaaaaaaaaaa',
			}
			const error = new ForbiddenException()

			jest.spyOn(listUseCase, 'handler').mockRejectedValueOnce(error)

			const result = await controller.getLibrariesList(body)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					error,
					body,
				),
			)
		})
	})

	describe('patch', () => {
		const body = {
			user: currentUser,
			status: LibraryStatus.TO_LEND,
			libraryId: 'aaaaaaaaaaaa',
		}

		it('should throw an error', async () => {
			const error = new ForbiddenException()

			jest.spyOn(patchLibraryUseCase, 'handler').mockRejectedValueOnce(
				error,
			)

			const result = await controller.patch(body)

			expect(result).toEqual(
				new MicroserviceResponseFormatter().buildFromException(
					error,
					body,
				),
			)
		})

		it('should update the library', async () => {
			const body = {
				user: currentUser,
				status: LibraryStatus.TO_LEND,
				libraryId: 'aaaaaaaaaaaa',
			}

			const mockLibrary: ILibrary = {
				userId: 'userId',
				bookId: 'bookId',
				place: 'somePlace',
				status: body.status,
				location: {
					coordinates: [0, 0],
					type: 'Point',
				},
			}
			jest.spyOn(patchLibraryUseCase, 'handler').mockImplementationOnce(
				() => Promise.resolve(mockLibrary),
			)

			const result = await controller.patch(body)
			expect(result).toEqual(
				new MicroserviceResponseFormatter(
					true,
					HttpStatus.OK,
					undefined,
					mockLibrary,
				),
			)
			expect(patchLibraryUseCase.handler).toHaveBeenCalledWith(
				currentUser._id,
				body.libraryId,
				body.status,
			)
		})
	})
})
