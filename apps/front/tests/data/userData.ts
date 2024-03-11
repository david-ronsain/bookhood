/* eslint-disable @nx/enforce-module-boundaries */
import { ICreateUserDTO, IUser, Role } from '../../../shared/src'

export const user: IUser = {
	_id: `userId`,
	lastName: `last`,
	firstName: `first`,
	email: `first.last@name.test`,
	role: [Role.USER],
	token: '||',
	tokenExpiration: new Date(Date.now() * 1000),
}

export const createdUser: ICreateUserDTO = {
	firstName: 'first',
	lastName: 'last',
	email: 'first.last@name.test',
}
