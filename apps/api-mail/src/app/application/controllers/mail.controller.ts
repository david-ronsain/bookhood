import { Controller, Inject } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import { ICreateUserDTO, IUser } from '@bookhood/shared'
import UserRegisteredUseCase from '../usecases/user/userRegistered.usecase'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import AuthSendLinkUseCase from '../usecases/user/authSendLink.usecase'

@Controller()
export class MailController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly userRegisteredUseCase: UserRegisteredUseCase,
		private readonly authSendLinkUseCase: AuthSendLinkUseCase
	) {}

	@MessagePattern('mail-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('mail-user-registered')
	userRegistered(user: ICreateUserDTO): void {
		this.userRegisteredUseCase.handler(user)
	}

	@MessagePattern('mail-auth-send-link')
	authSendLink(user: IUser): void {
		this.authSendLinkUseCase.handler(user)
	}
}
