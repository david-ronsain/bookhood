import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Query,
	UseGuards,
} from '@nestjs/common'

import { ClientProxy } from '@nestjs/microservices'
import {
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'
import {
	IBooksList,
	ILibrary,
	LibraryStatus,
	Locale,
	Role,
} from '@bookhood/shared'
import { BookNotFoundException, UserNotFoundException } from '../exceptions'
import {
	type CurrentUser,
	GetLibrariesListMQDTO,
	MicroserviceResponseFormatter,
	PatchLibraryMQDTO,
	MQLibraryMessageType,
	AuthUserGuard,
	User,
} from '@bookhood/shared-api'
import { RoleGuard } from '../guards/role.guard'
import { BooksList } from '../dto/library.dto'
import envConfig from '../../../config/env.config'

@Controller('library')
export class LibraryController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy,
	) {}

	@Get('user/:userId')
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'page', type: 'Number' })
	@ApiParam({ name: 'userId', type: 'String' })
	@ApiOperation({ description: 'Returns the libraries list' })
	@ApiOkResponse({ type: BooksList, status: HttpStatus.OK })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async getLibraries(
		@User() user: CurrentUser,
		@Param('userId') userId: string,
		@Query('page') page: number,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
	): Promise<IBooksList> {
		const books = await firstValueFrom<
			MicroserviceResponseFormatter<IBooksList>
		>(
			this.bookQueue.send(MQLibraryMessageType.LIST, {
				user,
				userId,
				page,
				session: {
					locale,
				},
			} as GetLibrariesListMQDTO),
		)

		if (!books.success) {
			throw new UserNotFoundException(books.message)
		}
		return books.data
	}

	@Patch(':libraryId')
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'status', type: 'String', enum: LibraryStatus })
	@ApiParam({ name: 'libraryId', type: 'String' })
	@ApiOperation({ description: 'Returns the libraries list' })
	@ApiOkResponse({ type: BooksList, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: BookNotFoundException, status: HttpStatus.NOT_FOUND })
	async patch(
		@User() user: CurrentUser,
		@Param('libraryId') libraryId: string,
		@Body('status') status: LibraryStatus,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
	): Promise<ILibrary> {
		const books = await firstValueFrom<
			MicroserviceResponseFormatter<ILibrary>
		>(
			this.bookQueue.send(MQLibraryMessageType.PATCH, {
				user,
				libraryId,
				status,
				session: {
					locale,
				},
			} as PatchLibraryMQDTO),
		)

		if (!books.success) {
			throw new BookNotFoundException(books.message)
		}
		return books.data
	}
}
