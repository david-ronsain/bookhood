import { ICreateUserDTO } from '@bookhood/shared'
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
