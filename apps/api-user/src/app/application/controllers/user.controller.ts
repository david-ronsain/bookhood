import { Controller, HttpStatus, Inject } from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { ICreateUserDTO } from '@bookhood/shared'
import CreateUserUseCase from '../usecases/createUser.usecase'
import type UserModel from '../../domain/models/user.model'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Controller()
export class UserController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitMail') private readonly rabbitMailClient: ClientProxy,
		private readonly createUserUseCase: CreateUserUseCase
	) {}

	@MessagePattern('user-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('user-create')
	async createUser(
		user: ICreateUserDTO
	): Promise<MicroserviceResponseFormatter<UserModel>> {
		try {
			const createdUser: UserModel = await this.createUserUseCase.handler(
				user
			)
			this.rabbitMailClient.send('mail-user-registered', user).subscribe()
			return new MicroserviceResponseFormatter<UserModel>(
				true,
				HttpStatus.CREATED,
				undefined,
				createdUser
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<UserModel>().buildFromException(
				err,
				user
			)
		}
	}
}
