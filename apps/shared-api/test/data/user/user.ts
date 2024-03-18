/* eslint-disable @nx/enforce-module-boundaries */
import { IExternalProfile, IUser, Role } from '../../../../shared/src'
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

export const userModel = {
	_id: 'id',
	firstName: 'first',
	lastName: 'last',
	email: 'first.last@name.test',
	role: [Role.GUEST],
}

export const userModelWithToken = {
	_id: 'id',
	firstName: 'first',
	lastName: 'last',
	email: 'first.last@name.test',
	token: '|token|',
	tokenExpiration: new Date(Date.now() + 1000000),
	role: [Role.GUEST],
}

export const externalProfile: IExternalProfile = {
	firstName: 'first',
	lastName: 'last',
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
}

export const userEntity = {
	_id: '123',
	firstName: 'first',
	lastName: 'last',
	role: [Role.GUEST],
	email: 'first.last@name.test',
	createdAt: new Date().toString(),
	updatedAt: new Date().toString(),
}

export const userRepository = {
	update: jest.fn(),
	createUser: jest.fn(),
	emailExists: jest.fn(),
	getUserByEmail: jest.fn(),
	getUserById: jest.fn(),
	getUserByToken: jest.fn(),
}

export const user: IUser = {
	_id: 'id',
	firstName: 'first',
	lastName: 'last',
	email: 'first.last@name.test',
	role: [Role.USER, Role.ADMIN],
}
