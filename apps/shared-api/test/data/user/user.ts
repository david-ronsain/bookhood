/* eslint-disable @nx/enforce-module-boundaries */
import { IUser, Role } from '../../../../shared/src'
import { CurrentUser } from '../../../src'

export const currentUser: CurrentUser = {
	_id: 'userId',
	token: 'token',
	email: 'first.last@name.test',
	roles: [Role.ADMIN],
	firstName: 'first',
}

export const userLight: IUser = {
	firstName: 'first',
	lastName: 'last',
	email: 'first.last@name.test',
	token: 'token',
}
