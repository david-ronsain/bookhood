import { BookRequestMailDTO, ICreateUserDTO } from '@bookhood/shared'
import { AuthSendLinkDTO, RequestInfosDTO } from '@bookhood/shared-api'

export interface IMailer {
	requestCreated(infos: BookRequestMailDTO): void

	requestAccepted(infos: RequestInfosDTO): void

	requestRefused(infos: RequestInfosDTO): void

	requestReturnedWithIssue(infos: RequestInfosDTO): void

	requestNeverReceived(infos: RequestInfosDTO): void

	userRegistered(user: ICreateUserDTO): void

	authSendLink(user: AuthSendLinkDTO): void

	sendEmail(
		from: string,
		to: string[],
		subject: string,
		body: string,
		cc: string[],
		bcc: string[],
	): unknown

	mailTo(email: string): string
}
