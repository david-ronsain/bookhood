/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { LibraryController } from '../../../../src/app/application/controllers/library.controller'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import { of, Observable } from 'rxjs'
import { IBooksList, ILibrary, LibraryStatus } from '../../../../../shared/src'
import ListUseCase from '../../../../src/app/application/usecases/library/list.usecase'
import PatchUseCase from '../../../../src/app/application/usecases/library/patch.usecase'
import { ClientProxy } from '@nestjs/microservices'

describe('LibraryController', () => {
	let controller: LibraryController
	let listUseCase: ListUseCase
	let patchLibraryUseCase: PatchUseCase
	let userClient: ClientProxy

	const invalidToken: Observable<any> = of(
		new MicroserviceResponseFormatter(
			false,
			HttpStatus.FORBIDDEN,
			{},
			{
				_id: 'mockUserId',
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			},
		),
	)
	const validToken: Observable<any> = of(
		new MicroserviceResponseFormatter(
			true,
			HttpStatus.OK,
			{},
			{
				_id: 'mockUserId',
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			},
		),
	)

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
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
			],
		}).compile()

		controller = module.get<LibraryController>(LibraryController)
		userClient = module.get<ClientProxy>('RabbitUser')
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
			const body = { token: 'mockToken', page: 1, userId: 'aaaaaaaaaaaa' }

			jest.spyOn(userClient, 'send').mockReturnValue(validToken)

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

		it('should return an error response if token is invalid', async () => {
			const body = {
				token: 'mock|Token',
				page: 1,
				userId: 'aaaaaaaaaaaa',
			}
			const error = new ForbiddenException()
			jest.spyOn(userClient, 'send').mockReturnValue(invalidToken)

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
			token: 'mock|Token',
			status: LibraryStatus.TO_LEND,
			libraryId: 'aaaaaaaaaaaa',
		}

		it('should return an error response if token is invalid', async () => {
			const error = new ForbiddenException()

			jest.spyOn(userClient, 'send').mockReturnValue(invalidToken)

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
				token: 'mock|Token',
				status: LibraryStatus.TO_LEND,
				libraryId: 'aaaaaaaaaaaa',
			}

			jest.spyOn(userClient, 'send').mockReturnValue(validToken)

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
				'mockUserId',
				body.libraryId,
				body.status,
			)
		})
	})
})
