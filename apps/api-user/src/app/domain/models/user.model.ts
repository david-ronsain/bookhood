import { IUser, Locale, Role } from '@bookhood/shared'

export default class UserModel {
	constructor(user?: IUser) {
		if (user) {
			this._id = user?._id?.toString()
			this.firstName = user.firstName
			this.lastName = user.lastName
			this.email = user.email
			this.role =
				Array.isArray(user.role) && user.role.length
					? user.role
					: [Role.USER]
			this.token = user.token
			this.tokenExpiration = user.tokenExpiration
			this.locale = user.locale
		}
	}

	readonly _id?: string

	readonly firstName: string

	readonly lastName: string

	readonly email: string

	readonly role?: Role[]

	token?: string

	tokenExpiration?: Date

	locale?: Locale
}
