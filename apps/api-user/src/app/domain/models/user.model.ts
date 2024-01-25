import { IUser, Role } from '@bookhood/shared'

export default class UserModel {
	constructor(user?: IUser) {
		if (user) {
			this.firstName = user.firstName
			this.lastName = user.lastName
			this.email = user.email
			this.role =
				Array.isArray(user.role) && user.role.length
					? user.role
					: [Role.USER]
		}
	}

	readonly firstName: string

	readonly lastName: string

	readonly email: string

	readonly role: Role[]
}
