/* eslint-disable @nx/enforce-module-boundaries */
import { IExternalProfile, IUser, Role } from '../../../shared/src'

export const externalProfile: IExternalProfile = {
	_id: 'profileId',
	firstName: 'first',
	lastName: 'last',
}

export const myProfile: IUser = {
	_id: 'userId',
	lastName: 'last',
	firstName: 'first',
	email: 'first.last@name.test',
	role: [Role.USER],
	token: 'token',
	tokenExpiration: new Date(),
}
