import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	HttpCode,
	HttpStatus,
	Inject,
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
import { Role } from '@bookhood/shared'
import { Roles } from '../guards/role.guard'
import { UserNotFoundException } from '../exceptions'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { SendLinkDTO, SigninDTO } from '../dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(
		@Inject('RabbitGateway') private readonly gatewayQueue: ClientProxy
	) {}

	@Post('link')
	@Roles([Role.GUEST])
	@ApiOperation({ description: 'Sends the login link' })
	@ApiBody({ type: SendLinkDTO })
	@ApiOkResponse({ type: Boolean, status: HttpStatus.OK })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: UserNotFoundException, status: HttpStatus.NOT_FOUND })
	async sendLink(@Body() dto: SendLinkDTO): Promise<boolean> {
		const sent = await firstValueFrom<
			MicroserviceResponseFormatter<boolean>
		>(this.gatewayQueue.send('auth-send-link', dto))
		if (!sent.success) {
			throw new UserNotFoundException(sent.message)
		}
		return true
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	@Roles([Role.GUEST])
	@ApiOperation({ description: 'Authenticates the user' })
	@ApiBody({ type: SigninDTO })
	@ApiOkResponse({ type: Boolean, status: HttpStatus.OK })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	async signin(@Body() dto: SigninDTO): Promise<boolean> {
		const verified = await firstValueFrom<
			MicroserviceResponseFormatter<boolean>
		>(this.gatewayQueue.send('auth-signin', dto))
		if (!verified.success) {
			throw new ForbiddenException(verified.message)
		}
		return true
	}
}
