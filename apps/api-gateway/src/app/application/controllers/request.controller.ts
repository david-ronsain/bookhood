import {
	BadRequestException,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Inject,
	Param,
	Post,
	Query,
	Patch,
	Body,
	NotFoundException,
	ForbiddenException,
	HttpCode,
	UseGuards,
	Headers,
} from '@nestjs/common'

import { ClientProxy } from '@nestjs/microservices'
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'
import {
	Role,
	IRequest,
	IRequestList,
	type IPatchRequestDTO,
	Locale,
} from '@bookhood/shared'
import { RoleGuard } from '../guards/role.guard'
import {
	CreateRequestMQDTO,
	type CurrentUser,
	GetRequestsMQDTO,
	MicroserviceResponseFormatter,
	PatchRequestDTO,
	PatchRequestMQDTO,
	MQRequestMessageType,
	AuthUserGuard,
	User,
} from '@bookhood/shared-api'
import { CreateRequestDTO, GetRequestsDTO } from '../dto/request.dto'
import envConfig from '../../../config/env.config'

@Controller('request')
export class RequestController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy,
	) {}

	@Post(':libraryId')
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiBody({ type: CreateRequestDTO })
	@ApiOperation({ description: 'Creates a request for a book' })
	@ApiParam({ name: 'libraryId', type: 'string' })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async create(
		@User() user: CurrentUser,
		@Param('libraryId') libraryId: string,
		@Body() body: CreateRequestDTO,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
	): Promise<IRequest> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<IRequest>
		>(
			this.bookQueue.send(MQRequestMessageType.CREATE, {
				libraryId,
				user,
				...body,
				session: {
					locale,
				},
			} as CreateRequestMQDTO),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiOperation({
		description: "List an user's requests depending on the status",
	})
	@ApiBody({ type: GetRequestsDTO })
	async getListByStatus(
		@User() user: CurrentUser,
		@Query() body: GetRequestsDTO,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
	): Promise<IRequestList> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<IRequestList>
		>(
			this.bookQueue.send(MQRequestMessageType.LIST, {
				...body,
				user,
				session: {
					locale,
				},
			} as GetRequestsMQDTO),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiOperation({
		description: 'Updates a request',
	})
	@ApiBody({ type: PatchRequestDTO })
	@ApiOkResponse({})
	@ApiResponse({ type: NotFoundException, status: HttpStatus.NOT_FOUND })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	async patch(
		@User() user: CurrentUser,
		@Body() body: IPatchRequestDTO,
		@Param('id') id: string,
		@Headers(envConfig().i18n.localeToken) locale: Locale,
	): Promise<IRequest> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<IRequest>
		>(
			this.bookQueue.send(MQRequestMessageType.PATCH, {
				...body,
				requestId: id,
				user,
				session: {
					locale,
				},
			} as PatchRequestMQDTO),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}
}
