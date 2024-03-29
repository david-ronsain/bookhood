import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Headers,
	HttpCode,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
	Query,
	UseGuards,
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
import {
	IBook,
	IBookSearch,
	Role,
	ILibraryFull,
	Locale,
} from '@bookhood/shared'
import { RoleGuard } from '../guards/role.guard'
import {
	MicroserviceResponseFormatter,
	type CurrentUser,
	AddBookMQDTO,
	SearchBookMQDTO,
	GetBookMQDTO,
	MQBookMessageType,
	AuthUserGuard,
	User,
} from '@bookhood/shared-api'
import { AddBookDTO, Book, BookSearch, BookSearchDTO } from '../dto/book.dto'
import { google } from 'googleapis'
import envConfig from '../../../config/env.config'

@Controller('book')
export class BookController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiOperation({ description: "Add a new book to one's library" })
	@ApiBody({ type: AddBookDTO })
	@ApiOkResponse({ type: Book, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	async addBook(
		@User() user: CurrentUser,
		@Body() book: AddBookDTO,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
		@Headers(envConfig().settings.sessionToken) token: string,
	): Promise<IBook> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<IBook>
		>(
			this.bookQueue.send(MQBookMessageType.CREATE, {
				user,
				book,
				session: {
					locale,
					token,
				},
			} as AddBookMQDTO),
		)
		if (!created.success) {
			throw new HttpException(created.message, created.code)
		}
		return created.data
	}

	@Get('google/:id')
	@ApiExcludeEndpoint()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
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
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
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
	@UseGuards(AuthUserGuard, new RoleGuard([Role.GUEST]))
	@ApiBody({ type: BookSearchDTO })
	@ApiOkResponse({ type: BookSearch, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	async getBooks(
		@User() user: CurrentUser,
		@Body() body: BookSearchDTO,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
		@Headers(envConfig().settings.sessionToken) token: string,
	): Promise<IBookSearch> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<IBookSearch>
		>(
			this.bookQueue.send(MQBookMessageType.SEARCH, {
				search: body.q,
				startAt: body.startIndex,
				language: 'fr',
				boundingBox: body.boundingBox,
				user,
				session: {
					locale,
					token,
				},
			} as SearchBookMQDTO),
		)
		if (!created.success) {
			throw new HttpException(created.message, created.code)
		}
		return created.data
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiOperation({ description: "Get one's books" })
	@ApiParam({ name: 'page', type: 'number' })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async getUserBooks(
		@User() user: CurrentUser,
		@Query('page') page: number,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
		@Headers(envConfig().settings.sessionToken) token: string,
	): Promise<ILibraryFull[]> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<ILibraryFull[]>
		>(
			this.bookQueue.send(MQBookMessageType.GET, {
				page,
				user,
				session: {
					locale,
					token,
				},
			} as GetBookMQDTO),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}
}
