import { Inject } from '@nestjs/common'
import { IMailer } from '../../../domain/ports/mailer.interface'
import { IRequestInfos } from '@bookhood/shared'

export default class RequestReturnedWithIssueUseCase {
	constructor(@Inject('Mailer') private readonly mailer: IMailer) {}

	handler(infos: IRequestInfos): void {
		this.mailer.requestReturnedWithIssue(infos)
	}
}
