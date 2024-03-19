import { Locale, Role } from '../enums'
import { Session } from './session.interface'

export interface IUser {
	_id?: string

	lastName: string

	firstName: string

	email: string

	role?: Role[]

	token?: string

	tokenExpiration?: Date

	locale?: Locale
}

export interface ICreateUserDTO extends Session {
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
