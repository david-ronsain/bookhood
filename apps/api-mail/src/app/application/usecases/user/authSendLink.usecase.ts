import { Inject } from '@nestjs/common'
import { IMailer } from '../../../domain/ports/mailer.interface'
import { AuthSendLinkDTO } from '@bookhood/shared-api'

export default class AuthSendLinkUseCase {
	constructor(@Inject('Mailer') private readonly mailer: IMailer) {}

	handler(user: AuthSendLinkDTO): void {
		this.mailer.authSendLink(user)
	}
}
