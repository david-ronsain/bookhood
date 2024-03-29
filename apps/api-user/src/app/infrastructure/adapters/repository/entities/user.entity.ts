import { IUser, Locale, Role } from '@bookhood/shared'
import { Document } from 'mongoose'

export interface UserEntity extends Document, IUser {
	readonly _id: string

	readonly createdAt: string

	readonly updatedAt: string

	readonly lastName: string

	readonly firstName: string

	readonly email: string

	readonly role?: Role[]

	readonly token?: string

	readonly tokenExpiration: Date

	readonly locale?: Locale
}
