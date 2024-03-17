import { Controller, HttpStatus, Inject } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import {
	IBook,
	type IAddBookDTO,
	IBookSearch,
	ILibraryFull,
} from '@bookhood/shared'
import {
	AddBookMQDTO,
	GetBookMQDTO,
	HealthCheckStatus,
	MQBookMessageType,
	MicroserviceResponseFormatter,
	SearchBookMQDTO,
	UserLibraryStats,
	UserRequestStats,
} from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import AddBookUseCase from '../usecases/book/addBook.usecase'
import BookModel from '../../domain/models/book.model'
import CreateBookIfNewUseCase from '../usecases/book/createBookIfNew.usecase'
import SearchBookUseCase from '../usecases/book/searchBook.usecase'
import GetUserBooksUseCase from '../usecases/book/getUserBooks.usecase'
import GetUserLibraryStatsUseCase from '../usecases/library/getUserLibraryStats.usecase'
import GetUserRequestStatsUseCase from '../usecases/request/getUserRequestStats.usecase'

@Controller()
export class BookController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly createBookIfNewUseCase: CreateBookIfNewUseCase,
		private readonly addBookUseCase: AddBookUseCase,
		private readonly getUserBooksUseCase: GetUserBooksUseCase,
		private readonly getUserLibraryStatsUseCase: GetUserLibraryStatsUseCase,
		private readonly getUserRequestStatsUseCase: GetUserRequestStatsUseCase,
		private readonly searchBookUseCase: SearchBookUseCase,
	) {}

	@MessagePattern(MQBookMessageType.HEALTH)
	health(): string {
		return HealthCheckStatus.UP
	}

	@MessagePattern(MQBookMessageType.CREATE)
	async addBook(
		body: AddBookMQDTO,
	): Promise<MicroserviceResponseFormatter<IBook>> {
		try {
			const book: BookModel = await this.createBookIfNewUseCase.handler(
				body.book,
			)

			await this.addBookUseCase.handler(
				book._id,
				body.user._id,
				body.book.location,
				body.book.status,
				body.book.place,
			)

			return new MicroserviceResponseFormatter<IBook>(
				true,
				HttpStatus.CREATED,
				undefined,
				book,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IAddBookDTO>().buildFromException(
				err,
				body,
			)
		}
	}

	@MessagePattern(MQBookMessageType.SEARCH)
	async searchBook(
		body: SearchBookMQDTO,
	): Promise<MicroserviceResponseFormatter<IBookSearch>> {
		try {
			const list = await this.searchBookUseCase.handler(
				body.search,
				body.startAt,
				body.language,
				body.boundingBox,
				body.user?.email,
			)

			return new MicroserviceResponseFormatter<IBookSearch>(
				true,
				HttpStatus.OK,
				undefined,
				list,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IBookSearch>().buildFromException(
				err,
				body,
			)
		}
	}

	@MessagePattern(MQBookMessageType.GET)
	async getUserBooks(
		body: GetBookMQDTO,
	): Promise<MicroserviceResponseFormatter<ILibraryFull[]>> {
		try {
			const libs: ILibraryFull[] = await this.getUserBooksUseCase.handler(
				body.user._id,
				body.page,
			)

			return new MicroserviceResponseFormatter<ILibraryFull[]>(
				true,
				HttpStatus.OK,
				undefined,
				libs,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<
				ILibraryFull[]
			>().buildFromException(err, body)
		}
	}

	@MessagePattern(MQBookMessageType.GET_STATS)
	async getUserBooksStats(
		userId: string,
	): Promise<
		MicroserviceResponseFormatter<UserLibraryStats & UserRequestStats>
	> {
		try {
			const libStats: UserLibraryStats =
				await this.getUserLibraryStatsUseCase.handler(userId)
			const reqStats: UserRequestStats =
				await this.getUserRequestStatsUseCase.handler(userId)

			const stats = {
				...libStats,
				...reqStats,
			}

			return new MicroserviceResponseFormatter<
				UserLibraryStats & UserRequestStats
			>(true, HttpStatus.OK, undefined, stats)
		} catch (err) {
			return new MicroserviceResponseFormatter<
				UserLibraryStats & UserRequestStats
			>().buildFromException(err, { userId })
		}
	}
}
