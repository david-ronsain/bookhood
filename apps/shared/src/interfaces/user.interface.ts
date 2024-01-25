import { Role } from '../enums'

export interface IUser {
	lastName: string

	firstName: string

	email: string

	role?: Role[]
}

export interface ICreateUserDTO {
	firstName: string

	lastName: string

	email: string
}
