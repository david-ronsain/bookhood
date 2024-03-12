import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
	UseGuards,
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
import { UserNotFoundException } from '../exceptions'
import {
	MQAuthMessageType,
	MicroserviceResponseFormatter,
} from '@bookhood/shared-api'
import { SendLinkDTO, SigninDTO } from '../dto/auth.dto'
import { RoleGuard } from '../guards/role.guard'

@Controller('auth')
export class AuthController {
	constructor(
		@Inject('RabbitUser') private readonly userQueue: ClientProxy,
	) {}

	@Post('link')
	@UseGuards(new RoleGuard([Role.GUEST]))
	@ApiOperation({ description: 'Sends the login link' })
	@ApiBody({ type: SendLinkDTO })
	@ApiOkResponse({ type: Boolean, status: HttpStatus.OK })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: UserNotFoundException, status: HttpStatus.NOT_FOUND })
	async sendLink(@Body() dto: SendLinkDTO): Promise<boolean> {
		const sent = await firstValueFrom<
			MicroserviceResponseFormatter<boolean>
		>(this.userQueue.send(MQAuthMessageType.SEND_LINK, dto))
		if (!sent.success) {
			throw new UserNotFoundException(sent.message)
		}
		return true
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	@UseGuards(new RoleGuard([Role.GUEST]))
	@ApiOperation({ description: 'Authenticates the user' })
	@ApiBody({ type: SigninDTO })
	@ApiOkResponse({ type: Boolean, status: HttpStatus.OK })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	async signin(@Body() dto: SigninDTO): Promise<boolean> {
		const verified = await firstValueFrom<
			MicroserviceResponseFormatter<boolean>
		>(this.userQueue.send(MQAuthMessageType.SIGNIN, dto))

		if (!verified.success) {
			throw new ForbiddenException(verified.message)
		}
		return true
	}
}
