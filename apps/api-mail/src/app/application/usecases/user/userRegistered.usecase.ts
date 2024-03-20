import { ICreateUserDTO } from '@bookhood/shared'
import { Inject } from '@nestjs/common'
import { IMailer } from '../../../domain/ports/mailer.interface'

export default class UserRegisteredUseCase {
	constructor(@Inject('Mailer') private readonly mailer: IMailer) {}

	handler(user: ICreateUserDTO): void {
		this.mailer.userRegistered(user)
	}
}
