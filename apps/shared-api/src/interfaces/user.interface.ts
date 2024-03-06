import { Role } from '@bookhood/shared'

export interface CurrentUser {
	_id: string

	roles: Role[]

	token: string

	email: string

	firstName: string
}
