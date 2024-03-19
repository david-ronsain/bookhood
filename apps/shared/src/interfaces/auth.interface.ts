import { IsEmail, IsNotEmpty } from 'class-validator'
import { Session } from './session.interface'

export class ISendLinkDTO extends Session {
	@IsNotEmpty()
	@IsEmail()
	email: string
}

export interface ISigninDTO extends Session {
	token: string
}
