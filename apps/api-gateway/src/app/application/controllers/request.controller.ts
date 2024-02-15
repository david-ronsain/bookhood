import {
	BadRequestException,
	Controller,
	Get,
	Headers,
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
	RequestStatus,
	IRequestList,
	IPatchRequestDTO,
} from '@bookhood/shared'
import { Roles } from '../guards/role.guard'
import {
	MicroserviceResponseFormatter,
	PatchRequestDTO,
	PatchRequestMQDTO,
} from '@bookhood/shared-api'

@Controller('request')
export class RequestController {
	constructor(
		@Inject('RabbitBook') private readonly bookQueue: ClientProxy,
	) {}

	@Post(':libraryId')
	@Roles([Role.USER, Role.ADMIN])
	@ApiOperation({ description: 'Creates a request for a book' })
	@ApiParam({ name: 'libraryId', type: 'string' })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	async create(
		@Param('libraryId') libraryId: string,
		@Headers('x-token') token?: string,
	): Promise<IRequest> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<IRequest>
		>(
			this.bookQueue.send('request-create', {
				libraryId,
				token,
			}),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}

	@Get('status/:status')
	@Roles([Role.USER, Role.ADMIN])
	@ApiOperation({
		description: "List an user's requests depending on the status",
	})
	@ApiParam({ name: 'status', type: 'string' })
	async getListByStatus(
		@Param('status') status: RequestStatus,
		@Query('startAt') startAt: number,
		@Headers('x-token') token?: string,
	): Promise<IRequestList> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<IRequestList>
		>(
			this.bookQueue.send('request-get-by-status', {
				status,
				token,
				startAt,
			}),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}

	@Patch(':id')
	@Roles([Role.USER, Role.ADMIN])
	@ApiOperation({
		description: 'Updates a request',
	})
	@ApiBody({ type: PatchRequestDTO })
	@ApiOkResponse({})
	@ApiResponse({ type: NotFoundException, status: HttpStatus.NOT_FOUND })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	async patch(
		@Body() body: IPatchRequestDTO,
		@Param('id') id: string,
		@Headers('x-token') token?: string,
	): Promise<IRequest> {
		const response = await firstValueFrom<
			MicroserviceResponseFormatter<IRequest>
		>(
			this.bookQueue.send('request-patch', {
				...body,
				requestId: id,
				token,
			} as PatchRequestMQDTO),
		)
		if (!response.success) {
			throw new HttpException(response.message, response.code)
		}
		return response.data
	}
}
