import { ICreateUserDTO, IUser } from '@bookhood/shared'

export interface IMailer {
	userRegistered(user: ICreateUserDTO): void

	authSendLink(user: IUser): void

	sendEmail(
		from: string,
		to: string[],
		subject: string,
		body: string,
		cc: string[],
		bcc: string[]
	): unknown

	mailTo(email: string): string
}
