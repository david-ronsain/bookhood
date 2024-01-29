import { ISendLinkDTO, ISigninDTO } from '@bookhood/shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class SendLinkDTO implements ISendLinkDTO {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string
}

export class SigninDTO implements ISigninDTO {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	token: string
}
