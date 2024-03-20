import { Controller, Inject } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import {
	BookRequestMailDTO,
	ICreateUserDTO,
	IRequestInfos,
	IUser,
} from '@bookhood/shared'
import UserRegisteredUseCase from '../usecases/user/userRegistered.usecase'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import AuthSendLinkUseCase from '../usecases/user/authSendLink.usecase'
import RequestCreatedUseCase from '../usecases/request/requestCreated.usecase'
import RequestAcceptedUseCase from '../usecases/request/requestAccepted.usecase'
import RequestRefusedUseCase from '../usecases/request/requestRefused.usecase'
import RequestNeverReceivedUseCase from '../usecases/request/requestNeverReceived.usecase'
import RequestReturnedWithIssueUseCase from '../usecases/request/requestReturnedWithIssue.usecase'
import {
	AuthSendLinkDTO,
	HealthCheckStatus,
	MQMailMessageType,
	RequestInfosDTO,
} from '@bookhood/shared-api'

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

	@MessagePattern(MQMailMessageType.HEALTH)
	health(): string {
		return HealthCheckStatus.UP
	}

	@MessagePattern(MQMailMessageType.USER_CREATED)
	userRegistered(user: ICreateUserDTO): void {
		this.userRegisteredUseCase.handler(user)
	}

	@MessagePattern(MQMailMessageType.AUTH_SEND_LINK)
	authSendLink(user: AuthSendLinkDTO): void {
		this.authSendLinkUseCase.handler(user)
	}

	@MessagePattern(MQMailMessageType.REQUEST_CREATED)
	requestCreated(infos: BookRequestMailDTO): void {
		this.requestCreatedUseCase.handler(infos)
	}

	@MessagePattern(MQMailMessageType.REQUEST_ACCEPTED)
	requestAccepted(infos: RequestInfosDTO): void {
		this.requestAcceptedUseCase.handler(infos)
	}

	@MessagePattern(MQMailMessageType.REQUEST_REFUSED)
	requestRefused(infos: RequestInfosDTO): void {
		this.requestRefusedUseCase.handler(infos)
	}

	@MessagePattern(MQMailMessageType.REQUEST_NEVER_RECEIVED)
	requestNeverReceived(infos: RequestInfosDTO): void {
		this.requestNeverReceivedUseCase.handler(infos)
	}

	@MessagePattern(MQMailMessageType.REQUEST_RETURNED_WITH_ISSUE)
	requestReturnedWithIssue(infos: RequestInfosDTO): void {
		this.requestReturnedWithIssueUseCase.handler(infos)
	}
}
