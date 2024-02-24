import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
	Query,
} from '@nestjs/common'

import { ClientProxy } from '@nestjs/microservices'
import {
	ApiBody,
	ApiExcludeEndpoint,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'
import { CreateUserDTO } from '../dto/user.dto'
import { IBook, IBookSearch, Role, ILibraryFull } from '@bookhood/shared'
import { Roles } from '../guards/role.guard'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { AddBookDTO } from '../dto/book.dto'
import { google } from 'googleapis'
import envConfig from '../../../config/env.config'

@Controller('book')
export class BookController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles([Role.USER, Role.ADMIN])
	@ApiOperation({ description: "Add a new book to one's library" })
	@ApiBody({ type: AddBookDTO })
	@ApiOkResponse({ type: CreateUserDTO, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async addBook(
		@Body() book: AddBookDTO,
		@Headers('x-token') token: string,
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
	@ApiExcludeEndpoint()
	@HttpCode(HttpStatus.OK)
	async getGoogleBookByISBN(@Param('id') isbn: string): Promise<unknown> {
		return google
			.books('v1')
			.volumes.list({
				key: envConfig().externalApis.google.key,
				q: 'isbn:' + isbn,
			})
			.then((response) => response.data)
	}

	@Post('google/search')
	@ApiExcludeEndpoint()
	@HttpCode(HttpStatus.OK)
	async getGoogleBooks(
		@Body('q') q: string,
		@Body('startIndex') startAt: number,
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
	@HttpCode(HttpStatus.OK)
	async getBooks(
		@Body('q') q: string,
		@Body('startIndex') startAt: number,
		@Body('boundingBox') box: number[],
		@Headers('x-token') token?: string,
	): Promise<IBookSearch> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<IBookSearch>
		>(
			this.bookQueue.send('book-search', {
				search: q,
				startAt,
				language: 'fr',
				boundingBox: box,
				token,
			}),
		)
		if (!created.success) {
			throw new HttpException(created.message, created.code)
		}
		return created.data
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles([Role.USER, Role.ADMIN])
	@ApiOperation({ description: "Get one's books" })
	@ApiParam({ name: 'page', type: 'number' })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async getUserBooks(
		@Query('page') page: number,
		@Headers('x-token') token?: string,
	): Promise<ILibraryFull[]> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<ILibraryFull[]>
		>(
			this.bookQueue.send('book-get', {
				page,
				token,
			}),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}
}
