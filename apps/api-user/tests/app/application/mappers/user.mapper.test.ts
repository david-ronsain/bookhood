/* eslint-disable @nx/enforce-module-boundaries */
import { Role } from '../../../../../shared/src'
import { UserEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/user.entity'
import UserMapper from '../../../../src/app/application/mappers/user.mapper'

describe('Testing UserMapper', () => {
	describe('the fromEntityToModel method', () => {
		it('should return the model', () => {
			const entity = {
				firstName: 'first',
				lastName: 'last',
				role: [Role.GUEST],
				email: 'first.last@name.test',
				createdAt: new Date().toString(),
				updatedAt: new Date().toString(),
			} as UserEntity
			const mapped = UserMapper.fromEntitytoModel(entity)

			expect(mapped).toMatchObject({
				firstName: entity.firstName,
				lastName: entity.lastName,
				role: entity.role,
				email: entity.email,
			})
		})
	})
})
