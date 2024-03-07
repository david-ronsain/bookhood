import {
	BadRequestException,
	Body,
	Controller,
	Get,
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
import { IBooksList, ILibrary, LibraryStatus, Role } from '@bookhood/shared'
import { BookNotFoundException, UserNotFoundException } from '../exceptions'
import {
	CurrentUser,
	GetLibrariesListMQDTO,
	MicroserviceResponseFormatter,
	PatchLibraryMQDTO,
} from '@bookhood/shared-api'
import { RoleGuard } from '../guards/role.guard'
import { BooksList } from '../dto/library.dto'
import { User } from '../decorators/user.decorator'
import { AuthUserGuard } from '../guards/authUser.guard'

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
	): Promise<IBooksList> {
		const books = await firstValueFrom<
			MicroserviceResponseFormatter<IBooksList>
		>(
			this.bookQueue.send('libraries-list', {
				user,
				userId,
				page,
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
	): Promise<ILibrary> {
		const books = await firstValueFrom<
			MicroserviceResponseFormatter<ILibrary>
		>(
			this.bookQueue.send('library-patch', {
				user,
				libraryId,
				status,
			} as PatchLibraryMQDTO),
		)

		if (!books.success) {
			throw new BookNotFoundException(books.message)
		}
		return books.data
	}
}