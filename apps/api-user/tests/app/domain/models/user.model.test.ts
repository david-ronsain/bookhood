/* eslint-disable @nx/enforce-module-boundaries */
import { IUser, Role } from '../../../../../shared/src'
import UserModel from '../../../../src/app/domain/models/user.model'

describe('Testing the UserModel', () => {
	it('should return a model with basic role', () => {
		const user = {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		} as IUser
		const userModel = new UserModel(user)
		expect(userModel.email).toBe(user.email)
		expect(userModel.role).toMatchObject([Role.USER])
		expect(userModel._id).toBeUndefined()
	})

	it('should return a model with given roles', () => {
		const user = {
			_id: 'id',
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
			role: [Role.USER, Role.ADMIN],
		} as IUser
		const userModel = new UserModel(user)

		expect(userModel.email).toBe(user.email)
		expect(userModel.role).toMatchObject([Role.USER, Role.ADMIN])
	})
})
