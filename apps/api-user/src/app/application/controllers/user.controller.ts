import {
	Controller,
	HttpStatus,
	Inject,
	NotFoundException,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { ICreateUserDTO, IUser, Role } from '@bookhood/shared'
import CreateUserUseCase from '../usecases/createUser.usecase'
import type UserModel from '../../domain/models/user.model'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import CreateAuthLinkUseCase from '../usecases/createAuthLink.usecase'
import GetUserByTokenUseCase from '../usecases/getUserByToken.usecase'
import RefreshTokenUseCase from '../usecases/refreshToken.usecase'

@Controller()
export class UserController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitMail') private readonly rabbitMailClient: ClientProxy,
		private readonly createAuthLinkUseCase: CreateAuthLinkUseCase,
		private readonly getUserByTokenUseCase: GetUserByTokenUseCase,
		private readonly refreshTokenUseCase: RefreshTokenUseCase,
		private readonly createUserUseCase: CreateUserUseCase,
	) {}

	@MessagePattern('user-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('user-create')
	async createUser(
		user: ICreateUserDTO,
	): Promise<MicroserviceResponseFormatter<UserModel>> {
		try {
			const createdUser: UserModel =
				await this.createUserUseCase.handler(user)
			this.createAuthLinkUseCase.handler(createdUser)
			this.rabbitMailClient
				.send('mail-user-registered', createdUser)
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

	@MessagePattern('user-get-role-by-token')
	async getRoleByEmail(token: string): Promise<Role[]> {
		try {
			const roles = await this.refreshTokenUseCase.handler(token)
			if (!roles) {
				throw new NotFoundException('user not found')
			}

			return roles
		} catch (err) {
			this.logger.error(err)
			return [Role.GUEST]
		}
	}

	@MessagePattern('user-get-by-token')
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

	@MessagePattern('user-get-profile')
	async getProfile(
		token: string,
	): Promise<MicroserviceResponseFormatter<IUser | null>> {
		try {
			const user: UserModel =
				await this.getUserByTokenUseCase.handler(token)

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
				{ token },
			)
		}
	}
}
