import { ICreateUserDTO, IExternalProfile } from '@bookhood/shared'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEmail } from 'class-validator'

export class CreateUserDTO implements ICreateUserDTO {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	firstName: string

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	lastName: string

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string
}

export class CreatedUser implements ICreateUserDTO {
	firstName: string

	lastName: string

	email: string
}

export class ExternalProfile implements IExternalProfile {
	_id: string

	lastName: string

	firstName: string
}
