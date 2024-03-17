/* eslint-disable @nx/enforce-module-boundaries */
import { IExternalProfile, IUser, IUserStats, Role } from '../../../shared/src'

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

export const userStats: IUserStats = {
	nbBooks: 1,
	nbPlaces: 2,
	nbBooksToLend: 3,
	nbBooksToGive: 4,
	nbIncomingRequests: 5,
	nbOutgoingRequests: 6,
}
