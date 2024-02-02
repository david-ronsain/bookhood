import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
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
import { CreateUserDTO } from '../dto/user.dto'
import { Role } from '@bookhood/shared'
import { Roles } from '../guards/role.guard'
import { UserEmailExistException } from '../exceptions'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'

@Controller('user')
export class UserController {
	constructor(
		@Inject('RabbitUser') private readonly userQueue: ClientProxy
	) {}

	@Post()
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
}
