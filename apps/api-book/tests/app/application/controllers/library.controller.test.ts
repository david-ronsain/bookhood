/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { LibraryController } from '../../../../src/app/application/controllers/library.controller'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import { ILibrary, LibraryStatus, Locale } from '../../../../../shared/src'
import ListUseCase from '../../../../src/app/application/usecases/library/list.usecase'
import PatchUseCase from '../../../../src/app/application/usecases/library/patch.usecase'
import { booksList, currentUser, library } from '../../../../../shared-api/test'
import envConfig from '../../../../../api-conversation/src/config/env.config'
import { ConfigModule } from '@nestjs/config'
import { I18nService } from 'nestjs-i18n'

describe('LibraryController', () => {
	let controller: LibraryController
	let listUseCase: ListUseCase
	let patchLibraryUseCase: PatchUseCase

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [envConfig],
				}),
			],
			controllers: [LibraryController],
			providers: [
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
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
				{
					provide: I18nService,
					useValue: {
						t: jest.fn(),
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
		const body = {
			user: currentUser,
			page: 1,
			userId: 'aaaaaaaaaaaa',
			locale: Locale.FR,
		}

		it('should return profile books when token is valid', async () => {
			const mockProfileBooks = booksList
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
			locale: Locale.FR,
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
			const mockLibrary: ILibrary = {
				...library,
				status: body.status,
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
