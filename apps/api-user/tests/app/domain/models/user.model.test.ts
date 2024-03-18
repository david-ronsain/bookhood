/* eslint-disable @nx/enforce-module-boundaries */
import { user } from '../../../../../shared-api/test'
import { Role } from '../../../../../shared/src'
import UserModel from '../../../../src/app/domain/models/user.model'

describe('Testing the UserModel', () => {
	it('should return a model with basic role', () => {
		const userModel = new UserModel({ ...user, role: [Role.USER] })
		expect(userModel.email).toBe(user.email)
		expect(userModel.role).toMatchObject([Role.USER])
	})

	it('should return a model with given roles', () => {
		const userModel = new UserModel(user)

		expect(userModel.email).toBe(user.email)
		expect(userModel._id).toBe(user._id)
		expect(userModel.role).toMatchObject([Role.USER, Role.ADMIN])
	})
})
