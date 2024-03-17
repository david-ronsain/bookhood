import { Role } from '../enums'

export interface IUser {
	_id?: string

	lastName: string

	firstName: string

	email: string

	role?: Role[]

	token?: string

	tokenExpiration?: Date
}

export interface ICreateUserDTO {
	firstName: string

	lastName: string

	email: string
}

export interface IExternalProfile {
	_id: string

	lastName: string

	firstName: string
}

export interface IUserStats {
	nbBooks: number

	nbPlaces: number

	nbBooksToLend: number

	nbBooksToGive: number

	nbIncomingRequests: number

	nbOutgoingRequests: number
}
