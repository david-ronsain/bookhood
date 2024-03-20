import { Inject } from '@nestjs/common'
import { IMailer } from '../../../domain/ports/mailer.interface'
import { RequestInfosDTO } from '@bookhood/shared-api'

export default class RequestAcceptedUseCase {
	constructor(@Inject('Mailer') private readonly mailer: IMailer) {}

	handler(infos: RequestInfosDTO): void {
		this.mailer.requestAccepted(infos)
	}
}
