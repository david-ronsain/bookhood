import {
	BookRequestMailDTO,
	ICreateUserDTO,
	IRequestInfos,
	IUser,
} from '@bookhood/shared'

export interface IMailer {
	requestCreated(infos: BookRequestMailDTO): void

	requestAccepted(infos: IRequestInfos): void

	requestRefused(infos: IRequestInfos): void

	requestReturnedWithIssue(infos: IRequestInfos): void

	requestNeverReceived(infos: IRequestInfos): void

	userRegistered(user: ICreateUserDTO): void

	authSendLink(user: IUser): void

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
