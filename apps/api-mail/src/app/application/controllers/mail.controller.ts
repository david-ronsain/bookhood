import { Controller, Inject } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import { BookRequestMailDTO, IRequestInfos, IUser } from '@bookhood/shared'
import UserRegisteredUseCase from '../usecases/user/userRegistered.usecase'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import AuthSendLinkUseCase from '../usecases/user/authSendLink.usecase'
import RequestCreatedUseCase from '../usecases/request/requestCreated.usecase'
import RequestAcceptedUseCase from '../usecases/request/requestAccepted.usecase'
import RequestRefusedUseCase from '../usecases/request/requestRefused.usecase'
import RequestNeverReceivedUseCase from '../usecases/request/requestNeverReceived.usecase'
import RequestReturnedWithIssueUseCase from '../usecases/request/requestReturnedWithIssue.usecase'

@Controller()
export class MailController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly userRegisteredUseCase: UserRegisteredUseCase,
		private readonly authSendLinkUseCase: AuthSendLinkUseCase,
		private readonly requestCreatedUseCase: RequestCreatedUseCase,
		private readonly requestAcceptedUseCase: RequestAcceptedUseCase,
		private readonly requestRefusedUseCase: RequestRefusedUseCase,
		private readonly requestNeverReceivedUseCase: RequestNeverReceivedUseCase,
		private readonly requestReturnedWithIssueUseCase: RequestReturnedWithIssueUseCase,
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
		this.requestAcceptedUseCase.handler(infos)
	}

	@MessagePattern('mail-request-refused')
	requestRefused(infos: IRequestInfos): void {
		this.requestRefusedUseCase.handler(infos)
	}

	@MessagePattern('mail-request-never-received')
	requestNeverReceived(infos: IRequestInfos): void {
		this.requestNeverReceivedUseCase.handler(infos)
	}

	@MessagePattern('mail-request-returned-with-issue')
	requestReturnedWithIssue(infos: IRequestInfos): void {
		this.requestReturnedWithIssueUseCase.handler(infos)
	}
}
