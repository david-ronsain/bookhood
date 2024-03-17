/* eslint-disable @nx/enforce-module-boundaries */
import { Role } from '../../../../shared/src'
import { CurrentUser } from '../../../src'

export const currentUser: CurrentUser = {
	_id: 'userId',
	token: 'token',
	email: 'first.last@name.test',
	roles: [Role.ADMIN],
	firstName: 'first',
}
