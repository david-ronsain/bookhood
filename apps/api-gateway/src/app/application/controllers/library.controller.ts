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
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { Roles } from '../guards/role.guard'
import { BooksList } from '../dto/library.dto'

@Controller('library')
export class LibraryController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy,
	) {}

	@Get('user/:userId')
	@Roles([Role.USER, Role.ADMIN])
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'page', type: 'Number' })
	@ApiParam({ name: 'userId', type: 'String' })
	@ApiOperation({ description: 'Returns the libraries list' })
	@ApiOkResponse({ type: BooksList, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async getLibraries(
		@Headers('x-token') token: string,
		@Param('userId') userId: string,
		@Query('page') page: number,
	): Promise<IBooksList> {
		const books = await firstValueFrom<
			MicroserviceResponseFormatter<IBooksList>
		>(this.bookQueue.send('libraries-list', { token, userId, page }))

		if (!books.success) {
			throw new UserNotFoundException(books.message)
		}
		return books.data
	}

	@Patch(':libraryId')
	@Roles([Role.USER, Role.ADMIN])
	@HttpCode(HttpStatus.OK)
	@ApiParam({ name: 'status', type: 'String', enum: LibraryStatus })
	@ApiParam({ name: 'libraryId', type: 'String' })
	@ApiOperation({ description: 'Returns the libraries list' })
	@ApiOkResponse({ type: BooksList, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: BookNotFoundException, status: HttpStatus.NOT_FOUND })
	async patch(
		@Headers('x-token') token: string,
		@Param('libraryId') libraryId: string,
		@Body('status') status: LibraryStatus,
	): Promise<ILibrary> {
		const books = await firstValueFrom<
			MicroserviceResponseFormatter<ILibrary>
		>(this.bookQueue.send('library-patch', { token, libraryId, status }))

		if (!books.success) {
			throw new BookNotFoundException(books.message)
		}
		return books.data
	}
}
