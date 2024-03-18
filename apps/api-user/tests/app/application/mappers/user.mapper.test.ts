/* eslint-disable @nx/enforce-module-boundaries */
import UserMapper from '../../../../src/app/application/mappers/user.mapper'
import { userEntity } from '../../../../../shared-api/test'
import { UserEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/user.entity'

describe('Testing UserMapper', () => {
	describe('the fromEntityToModel method', () => {
		it('should return the model', () => {
			const mapped = UserMapper.fromEntitytoModel(
				userEntity as unknown as UserEntity,
			)

			expect(mapped).toMatchObject({
				firstName: userEntity.firstName,
				lastName: userEntity.lastName,
				role: userEntity.role,
				email: userEntity.email,
			})
		})
	})
})
