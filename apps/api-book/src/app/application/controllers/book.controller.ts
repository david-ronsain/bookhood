import {
	Controller,
	ForbiddenException,
	HttpStatus,
	Inject,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import {
	IBook,
	type IAddBookDTO,
	IUser,
	IBookSearch,
	ILibraryFull,
	IBooksList,
} from '@bookhood/shared'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import AddBookUseCase from '../usecases/book/addBook.usecase'
import BookModel from '../../domain/models/book.model'
import CreateBookIfNewUseCase from '../usecases/book/createBookIfNew.usecase'
import { firstValueFrom } from 'rxjs'
import SearchBookUseCase from '../usecases/book/searchBook.usecase'
import GetUserBooksUseCase from '../usecases/book/getUserBooks.usecase'
import { GetUserBooksDTO } from '../dto/user.dto'
import GetProfileBooksUseCase from '../usecases/book/getProfileBooks.usecase'

@Controller()
export class BookController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitUser') private readonly userClient: ClientProxy,
		@Inject('RabbitMail') private readonly mailClient: ClientProxy,
		private readonly createBookIfNewUseCase: CreateBookIfNewUseCase,
		private readonly addBookUseCase: AddBookUseCase,
		private readonly getUserBooksUseCase: GetUserBooksUseCase,
		private readonly searchBookUseCase: SearchBookUseCase,
		private readonly getProfileBooksUseCase: GetProfileBooksUseCase,
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

			const userData = await this.checkUserToken(body.token)

			await this.addBookUseCase.handler(
				book._id,
				userData._id,
				body.data.book.location,
				body.data.book.status,
				body.data.book.place,
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
		token?: string
	}): Promise<MicroserviceResponseFormatter<IBookSearch>> {
		try {
			const [email] = (body?.token?.split('|') || []).map(
				(token: string, index: number) =>
					index === 0
						? Buffer.from(token, 'base64').toString()
						: token,
			)
			const list = await this.searchBookUseCase.handler(
				body.search,
				body.startAt,
				body.language,
				body.boundingBox,
				email,
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

	@MessagePattern('book-get')
	async getUserBooks(body: {
		token: string
		page: number
	}): Promise<MicroserviceResponseFormatter<ILibraryFull[]>> {
		try {
			const userData = await this.checkUserToken(body.token)

			const libs: ILibraryFull[] = await this.getUserBooksUseCase.handler(
				userData._id,
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

	private async checkUserToken(requestToken: string): Promise<IUser> {
		const token = requestToken?.split('|') ?? []
		if (token.length === 3) {
			token.pop()
		}

		const userData = await firstValueFrom<
			MicroserviceResponseFormatter<IUser | null>
		>(this.userClient.send('user-get-by-token', token.join('|')))
		if (!userData.success) {
			throw new ForbiddenException()
		}

		return userData.data
	}

	@MessagePattern('profile-books')
	async getProfileBooks(
		body: GetUserBooksDTO,
	): Promise<MicroserviceResponseFormatter<IBooksList>> {
		try {
			await this.checkUserToken(body.token)

			const books: IBooksList = await this.getProfileBooksUseCase.handler(
				body.userId,
				body.page,
			)

			return new MicroserviceResponseFormatter<IBooksList>(
				true,
				HttpStatus.OK,
				undefined,
				books,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IBooksList>().buildFromException(
				err,
				body,
			)
		}
	}
}
