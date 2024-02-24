import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	Headers,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common'

import { ClientProxy } from '@nestjs/microservices'
import {
	ApiBody,
	ApiExcludeEndpoint,
	ApiOkResponse,
	ApiOperation,
	ApiResponse,
} from '@nestjs/swagger'
import { firstValueFrom } from 'rxjs'
import { CreateUserDTO } from '../dto/user.dto'
import { IUser, Role } from '@bookhood/shared'
import { Roles } from '../guards/role.guard'
import { UserEmailExistException, UserNotFoundException } from '../exceptions'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'

@Controller('user')
export class UserController {
	constructor(
		@Inject('RabbitUser') private readonly userQueue: ClientProxy,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles([Role.GUEST])
	@ApiOperation({ description: 'Creates a new user' })
	@ApiBody({ type: CreateUserDTO })
	@ApiOkResponse({ type: CreateUserDTO, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	@ApiResponse({ type: UserEmailExistException, status: HttpStatus.CONFLICT })
	async createUser(@Body() user: CreateUserDTO): Promise<CreateUserDTO> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<CreateUserDTO>
		>(this.userQueue.send('user-create', user))
		if (!created.success) {
			throw new UserEmailExistException(created.message)
		}
		return created.data
	}

	@Get('me')
	@HttpCode(HttpStatus.OK)
	@ApiExcludeEndpoint()
	async getProfile(@Headers('x-token') token?: string): Promise<IUser> {
		if (!token) {
			throw new UserNotFoundException('')
		}

		const tokenParts = token?.split('|')
		if (tokenParts.length === 3) {
			tokenParts.pop()
			token = tokenParts.join('|')
		}

		const profile = await firstValueFrom<
			MicroserviceResponseFormatter<IUser>
		>(this.userQueue.send('user-get-profile', token))

		if (!profile.success) {
			throw new UserNotFoundException(profile.message)
		}
		return profile.data
	}
}
