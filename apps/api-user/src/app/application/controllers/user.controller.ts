import {
	Controller,
	HttpStatus,
	Inject,
	NotFoundException,
	UseGuards,
} from '@nestjs/common'

import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices'
import { ICreateUserDTO, IExternalProfile, IUser, Role } from '@bookhood/shared'
import CreateUserUseCase from '../usecases/createUser.usecase'
import type UserModel from '../../domain/models/user.model'
import {
	AuthUserGuard,
	GetProfileByTokenMQDTO,
	GetProfileMQDTO,
	HealthCheckStatus,
	MQBookMessageType,
	MQMailMessageType,
	MQUserMessageType,
	MicroserviceResponseFormatter,
	UserLibraryStats,
	UserRequestStats,
} from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { firstValueFrom } from 'rxjs'
import CreateAuthLinkUseCase from '../usecases/createAuthLink.usecase'
import GetUserByTokenUseCase from '../usecases/getUserByToken.usecase'
import RefreshTokenUseCase from '../usecases/refreshToken.usecase'
import GetUserByIdUseCase from '../usecases/getUserById.usecase'
import { I18nContext, I18nService } from 'nestjs-i18n'

@Controller()
export class UserController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitMail') private readonly rabbitMailClient: ClientProxy,
		@Inject('RabbitBook') private readonly rabbitBook: ClientProxy,
		private readonly createAuthLinkUseCase: CreateAuthLinkUseCase,
		private readonly getUserByTokenUseCase: GetUserByTokenUseCase,
		private readonly getUserByIdUseCase: GetUserByIdUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
		private readonly createUserUseCase: CreateUserUseCase,
		private readonly i18n: I18nService,
	) {}

	@MessagePattern(MQUserMessageType.HEALTH)
	health(): string {
		return HealthCheckStatus.UP
	}

	@MessagePattern(MQUserMessageType.CREATE)
	async createUser(
		user: ICreateUserDTO,
	): Promise<MicroserviceResponseFormatter<UserModel>> {
		try {
			const createdUser: UserModel =
				await this.createUserUseCase.handler(user)
			this.createAuthLinkUseCase.handler(createdUser)
			user.session.token = createdUser.token
			this.rabbitMailClient
				.send(MQMailMessageType.USER_CREATED, user)
				.subscribe()
			return new MicroserviceResponseFormatter<UserModel>(
				true,
				HttpStatus.CREATED,
				undefined,
				createdUser,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<UserModel>().buildFromException(
				err,
				user,
			)
		}
	}

	@MessagePattern(MQUserMessageType.GET_ROLE_BY_TOKEN)
	async getRoleByEmail(token: string): Promise<Role[]> {
		try {
			const roles = await this.refreshTokenUseCase.handler(token)
			if (!roles) {
				throw new NotFoundException(
					this.i18n.t('errors.user.notFound', {
						lang: I18nContext.current()?.lang,
					}),
				)
			}

			return roles
		} catch (err) {
			this.logger.error(err)
			return [Role.GUEST]
		}
	}

	@MessagePattern(MQUserMessageType.GET_BY_TOKEN)
	async getByToken(
		token: string,
	): Promise<MicroserviceResponseFormatter<IUser | null>> {
		try {
			const user: UserModel =
				await this.getUserByTokenUseCase.handler(token)

			return new MicroserviceResponseFormatter<IUser | null>(
				true,
				HttpStatus.CREATED,
				undefined,
				user,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IUser | null>().buildFromException(
				err,
				{ token },
			)
		}
	}

	@UseGuards(AuthUserGuard)
	@MessagePattern(MQUserMessageType.GET_ME)
	async me(
		dto: GetProfileByTokenMQDTO,
	): Promise<MicroserviceResponseFormatter<IUser | null>> {
		try {
			const user: UserModel = await this.getUserByTokenUseCase.handler(
				dto.token,
			)

			return new MicroserviceResponseFormatter<IUser | null>(
				true,
				HttpStatus.OK,
				undefined,
				{
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					role: user.role,
					_id: user._id,
				},
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IUser | null>().buildFromException(
				err,
				{ token: dto.token },
			)
		}
	}

	@UseGuards(AuthUserGuard)
	@MessagePattern(MQUserMessageType.GET_PROFILE)
	async getProfile(
		@Payload() body: GetProfileMQDTO,
	): Promise<MicroserviceResponseFormatter<IExternalProfile | null>> {
		try {
			const user: UserModel = await this.getUserByIdUseCase.handler(
				body.userId,
			)

			return new MicroserviceResponseFormatter<IExternalProfile | null>(
				true,
				HttpStatus.OK,
				undefined,
				{
					firstName: user.firstName,
					lastName: user.lastName,
					_id: user._id,
				},
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IExternalProfile | null>().buildFromException(
				err,
				body,
			)
		}
	}

	@UseGuards(AuthUserGuard)
	@MessagePattern(MQUserMessageType.GET_STATS)
	async getStats(
		userId: string,
	): Promise<
		MicroserviceResponseFormatter<UserLibraryStats & UserRequestStats>
	> {
		try {
			return await firstValueFrom<
				MicroserviceResponseFormatter<
					UserLibraryStats & UserRequestStats
				>
			>(this.rabbitBook.send(MQBookMessageType.GET_STATS, userId))
		} catch (err) {
			return new MicroserviceResponseFormatter<
				UserLibraryStats & UserRequestStats
			>().buildFromException(err, { userId })
		}
	}
}
