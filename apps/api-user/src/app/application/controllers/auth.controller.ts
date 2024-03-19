import {
	Body,
	Controller,
	ForbiddenException,
	HttpStatus,
	Inject,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { ISendLinkDTO, ISigninDTO } from '@bookhood/shared'
import {
	HealthCheckStatus,
	MQAuthMessageType,
	MQMailMessageType,
	MicroserviceResponseFormatter,
} from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import CreateAuthLinkUseCase from '../usecases/createAuthLink.usecase'
import UserModel from '../../domain/models/user.model'
import VerifyAuthTokenUseCase from '../usecases/verifyAuthToken.usecase'
import GetUserByEmailUseCase from '../usecases/getUserByEmail.usecase'
import { I18nContext, I18nService } from 'nestjs-i18n'

@Controller()
export class AuthController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
		private readonly createAuthLinkUseCase: CreateAuthLinkUseCase,
		private readonly verifyAuthTokenUseCase: VerifyAuthTokenUseCase,
		@Inject('RabbitMail') private readonly rabbitMailClient: ClientProxy,
		private readonly i18n: I18nService,
	) {}

	@MessagePattern(MQAuthMessageType.HEALTH)
	health(): string {
		return HealthCheckStatus.UP
	}

	@MessagePattern(MQAuthMessageType.SEND_LINK)
	async sendLink(
		@Body() dto: ISendLinkDTO,
	): Promise<MicroserviceResponseFormatter<boolean>> {
		try {
			const user: UserModel = await this.getUserByEmailUseCase.handler(
				dto.email,
			)
			this.createAuthLinkUseCase.handler(user)
			if (user) {
				this.rabbitMailClient
					.send(MQMailMessageType.AUTH_SEND_LINK, user)
					.subscribe()
			}

			return new MicroserviceResponseFormatter<boolean>(
				true,
				HttpStatus.OK,
				dto,
				!!user,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<boolean>().buildFromException(
				err,
				dto,
			)
		}
	}

	@MessagePattern(MQAuthMessageType.SIGNIN)
	async signin(
		@Body() dto: ISigninDTO,
	): Promise<MicroserviceResponseFormatter<boolean>> {
		try {
			const token = dto.token.split('|')
			if (token.length !== 2) {
				throw new ForbiddenException(
					this.i18n.t('errors.auth.forbidden', {
						lang: I18nContext.current()?.lang,
					}),
				)
			}

			token[0] = Buffer.from(token[0], 'base64').toString()

			await this.verifyAuthTokenUseCase.handler(token[0], token[1])

			return new MicroserviceResponseFormatter<boolean>(
				true,
				HttpStatus.OK,
				dto,
				true,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<boolean>().buildFromException(
				err,
				dto,
			)
		}
	}
}
