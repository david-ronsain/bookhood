import {
	BadRequestException,
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	UseGuards,
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
import {
	CreateUserDTO,
	CreatedUser,
	ExternalProfile,
	UserStats,
} from '../dto/user.dto'
import { IExternalProfile, IUser, Role } from '@bookhood/shared'
import { RoleGuard } from '../guards/role.guard'
import { UserEmailExistException, UserNotFoundException } from '../exceptions'
import {
	type CurrentUser,
	GetProfileMQDTO,
	MicroserviceResponseFormatter,
	MQUserMessageType,
} from '@bookhood/shared-api'
import { AuthUserGuard } from '../guards/authUser.guard'
import { User } from '../decorators/user.decorator'

@Controller('user')
export class UserController {
	constructor(
		@Inject('RabbitUser') private readonly userQueue: ClientProxy,
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(new RoleGuard([Role.GUEST]))
	@ApiOperation({ description: 'Creates a new user' })
	@ApiBody({ type: CreateUserDTO })
	@ApiOkResponse({ type: CreatedUser, status: HttpStatus.CREATED })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: ForbiddenException, status: HttpStatus.FORBIDDEN })
	@ApiResponse({ type: UserEmailExistException, status: HttpStatus.CONFLICT })
	async createUser(@Body() user: CreateUserDTO): Promise<CreateUserDTO> {
		const created = await firstValueFrom<
			MicroserviceResponseFormatter<CreateUserDTO>
		>(this.userQueue.send(MQUserMessageType.CREATE, user))
		if (!created.success) {
			throw new UserEmailExistException(created.message)
		}
		return created.data
	}

	@Get('me')
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@HttpCode(HttpStatus.OK)
	@ApiExcludeEndpoint()
	async me(@User() user: CurrentUser): Promise<IUser> {
		if (!user.token) {
			throw new UserNotFoundException('')
		}

		const tokenParts = user.token?.split('|')
		if (tokenParts.length === 3) {
			tokenParts.pop()
			user.token = tokenParts.join('|')
		}

		const profile = await firstValueFrom<
			MicroserviceResponseFormatter<IUser>
		>(this.userQueue.send(MQUserMessageType.GET_ME, user.token))

		if (!profile.success) {
			throw new UserNotFoundException(profile.message)
		}
		return profile.data
	}

	@Get('stats')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiOperation({ description: "Returns an user's stats" })
	@ApiOkResponse({ type: UserStats, status: HttpStatus.OK })
	async getStats(@User() user: CurrentUser): Promise<UserStats> {
		if (!user.token) {
			throw new UserNotFoundException('')
		}

		const stats = await firstValueFrom<
			MicroserviceResponseFormatter<UserStats>
		>(this.userQueue.send(MQUserMessageType.GET_STATS, user._id))

		return stats.data
	}

	@Get(':userId')
	@HttpCode(HttpStatus.OK)
	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.ADMIN]))
	@ApiOperation({ description: "Returns an user's profile" })
	@ApiOkResponse({ type: ExternalProfile, status: HttpStatus.OK })
	@ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
	@ApiResponse({ type: UserNotFoundException, status: HttpStatus.NOT_FOUND })
	async getProfile(
		@User() user: CurrentUser,
		@Param('userId') userId: string,
	): Promise<IExternalProfile> {
		const profile = await firstValueFrom<
			MicroserviceResponseFormatter<IExternalProfile>
		>(
			this.userQueue.send(MQUserMessageType.GET_PROFILE, {
				user,
				userId,
			} as GetProfileMQDTO),
		)

		if (!profile.success) {
			throw new UserNotFoundException(profile.message)
		}
		return profile.data
	}
}
