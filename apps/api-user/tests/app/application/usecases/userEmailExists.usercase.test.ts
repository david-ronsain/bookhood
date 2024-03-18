/* eslint-disable @nx/enforce-module-boundaries */
import UserEmailExistsUseCase from '../../../../src/app/application/usecases/userEmailExists.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { NotFoundException } from '@nestjs/common'
import { userRepository as userRepo } from '../../../../../shared-api/test'

describe('Testing the UserEmailExistsUseCase', () => {
	let usecase: UserEmailExistsUseCase

	const mock = { ...userRepo } as unknown as UserRepository

	beforeEach(async () => {
		jest.clearAllMocks()

		usecase = new UserEmailExistsUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			jest.spyOn(mock, 'emailExists').mockResolvedValue(false)

			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
			expect(mock.emailExists).toHaveBeenCalledWith('')
		})

		it('should return the user', async () => {
			jest.spyOn(mock, 'emailExists').mockResolvedValue(true)

			const email = 'first.last@name.test'
			expect(usecase.handler(email)).resolves.toBe(true)
			expect(mock.emailExists).toHaveBeenCalledWith(email)
		})
	})
})
