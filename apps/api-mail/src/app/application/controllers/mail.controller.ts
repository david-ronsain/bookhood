import { Controller, Inject } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import { ICreateUserDTO } from '@bookhood/shared'
import UserRegisteredUseCase from '../usecases/user/userRegistered.usecase'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

@Controller()
export class MailController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly userRegisteredUseCase: UserRegisteredUseCase
	) {}

	@MessagePattern('mail-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('mail-user-registered')
	userRegistered(user: ICreateUserDTO): void {
		this.userRegisteredUseCase.handler(user)
	}
}
