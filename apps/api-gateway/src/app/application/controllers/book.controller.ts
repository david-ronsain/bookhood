import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Headers,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
} from '@nestjs/common'

import { ClientProxy } from '@nestjs/microservices'
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'
import { CreateUserDTO } from '../dto/user.dto'
import { IBook, IBookSearch, Role } from '@bookhood/shared'
import { Roles } from '../guards/role.guard'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { AddBookDTO } from '../dto/book.dto'
import { google } from 'googleapis'
import envConfig from '../../../config/env.config'

@Controller('book')
export class BookController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy
	) {}

	@Post()
	@Roles([Role.USER, Role.ADMIN])
	@ApiOperation({ description: "Add a new book to one's library" })
	@ApiBody({ type: AddBookDTO })
	@ApiOkResponse({ type: CreateUserDTO, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async addBook(
		@Body() book: AddBookDTO,
		@Headers('x-token') token: string
	): Promise<IBook> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<IBook>
		>(this.bookQueue.send('book-add', { token, data: { book } }))
		if (!created.success) {
			throw new HttpException(created.message, created.code)
		}
		return created.data
	}

	@Get('google/:id')
	async getGoogleBookByISBN(@Param('id') isbn: string): Promise<unknown> {
		return google
			.books('v1')
			.volumes.list({
				key: 'AIzaSyBnfn5W-NEkC9BeCLuxGOe1MAeP4U6uK9s',
				q: 'isbn:' + isbn,
			})
			.then((response) => response.data)
	}

	@Post('google/search')
	async getGoogleBooks(
		@Body('q') q: string,
		@Body('startIndex') startAt: number
	): Promise<unknown> {
		return google
			.books('v1')
			.volumes.list({
				key: envConfig().externalApis.google.key,
				q,
				startIndex: startAt,
				printType: 'books',
				langRestrict: 'fr',
			})
			.then((response) => response.data)
	}

	@Post('search')
	async getBooks(
		@Body('q') q: string,
		@Body('startIndex') startAt: number,
		@Body('boundingBox') box: number[]
	): Promise<IBookSearch> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<IBookSearch>
		>(
			this.bookQueue.send('book-search', {
				search: q,
				startAt,
				language: 'fr',
				boundingBox: box,
			})
		)
		if (!created.success) {
			throw new HttpException(created.message, created.code)
		}
		return created.data
	}
}
