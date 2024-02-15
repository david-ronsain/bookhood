import { Inject } from '@nestjs/common'
import { IMailer } from '../../../domain/ports/mailer.interface'
import { BookRequestMailDTO } from '@bookhood/shared'

export default class RequestCreatedUseCase {
	constructor(@Inject('Mailer') private readonly mailer: IMailer) {}

	handler(infos: BookRequestMailDTO): void {
		this.mailer.requestCreated(infos)
	}
}
