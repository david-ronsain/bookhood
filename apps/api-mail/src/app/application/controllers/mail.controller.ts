import { Controller, Inject } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import { BookRequestMailDTO, IRequestInfos, IUser } from '@bookhood/shared'
import UserRegisteredUseCase from '../usecases/user/userRegistered.usecase'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import AuthSendLinkUseCase from '../usecases/user/authSendLink.usecase'
import RequestCreatedUseCase from '../usecases/request/requestCreated.usecase'
import RequestAcceptedtUseCase from '../usecases/request/requestAccepted.usecase'
import RequestRefusedUseCase from '../usecases/request/requestRefused.usecase'

@Controller()
export class MailController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly userRegisteredUseCase: UserRegisteredUseCase,
		private readonly authSendLinkUseCase: AuthSendLinkUseCase,
		private readonly requestCreatedUseCase: RequestCreatedUseCase,
		private readonly requestAcceptedtUseCase: RequestAcceptedtUseCase,
		private readonly requestRefusedUseCase: RequestRefusedUseCase,
	) {}

	@MessagePattern('mail-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('mail-user-registered')
	userRegistered(user: IUser): void {
		this.userRegisteredUseCase.handler(user)
	}

	@MessagePattern('mail-auth-send-link')
	authSendLink(user: IUser): void {
		this.authSendLinkUseCase.handler(user)
	}

	@MessagePattern('mail-request-created')
	requestCreated(infos: BookRequestMailDTO): void {
		this.requestCreatedUseCase.handler(infos)
	}

	@MessagePattern('mail-request-accepted')
	requestAccepted(infos: IRequestInfos): void {
		this.requestAcceptedtUseCase.handler(infos)
	}

	@MessagePattern('mail-request-refused')
	requestRefused(infos: IRequestInfos): void {
		this.requestRefusedUseCase.handler(infos)
	}
}
