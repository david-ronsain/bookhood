import { Controller, HttpStatus, Inject } from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { IBook, type IAddBookDTO, IUser, IBookSearch } from '@bookhood/shared'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import AddBookUseCase from '../usecases/addBook.usecase'
import BookModel from '../../domain/models/book.model'
import CreateBookIfNewUseCase from '../usecases/createBookIfNew.usecase'
import { firstValueFrom } from 'rxjs'
import SearchBookUseCase from '../usecases/searchBook.usecase'

@Controller()
export class BookController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitUser') private readonly userClient: ClientProxy,
		private readonly createBookIfNewUseCase: CreateBookIfNewUseCase,
		private readonly addBookUseCase: AddBookUseCase,
		private readonly searchBookUseCase: SearchBookUseCase,
	) {}

	@MessagePattern('book-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('book-add')
	async addBook(body: {
		token: string
		data: { book: IAddBookDTO }
	}): Promise<MicroserviceResponseFormatter<IBook>> {
		try {
			const book: BookModel = await this.createBookIfNewUseCase.handler(
				body.data.book,
			)

			const token = body.token?.split('|') ?? []
			if (token.length === 3) {
				token.pop()
			}

			const userData = await firstValueFrom<
				MicroserviceResponseFormatter<IUser | null>
			>(this.userClient.send('user-get-by-token', token.join('|')))

			await this.addBookUseCase.handler(
				book._id,
				userData.data._id,
				body.data.book.location,
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
				body.data.book,
			)
		}
	}

	@MessagePattern('book-search')
	async searchBook(body: {
		search: string
		startAt: number
		language: string
		boundingBox: number[]
	}): Promise<MicroserviceResponseFormatter<IBookSearch>> {
		try {
			const list = await this.searchBookUseCase.handler(
				body.search,
				body.startAt,
				body.language,
				body.boundingBox,
			)

			return new MicroserviceResponseFormatter<IBookSearch>(
				true,
				HttpStatus.CREATED,
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
}
