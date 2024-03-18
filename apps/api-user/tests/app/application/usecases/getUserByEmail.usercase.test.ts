/* eslint-disable @nx/enforce-module-boundaries */
import GetUserByEmailUseCase from '../../../../src/app/application/usecases/getUserByEmail.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { NotFoundException } from '@nestjs/common'
import {
	userModel,
	userRepository as userRepo,
} from '../../../../../shared-api/test'

describe('Testing the GetUserByEmailUseCase', () => {
	let usecase: GetUserByEmailUseCase

	const mock = { ...userRepo } as unknown as UserRepository

	beforeEach(async () => {
		usecase = new GetUserByEmailUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			jest.spyOn(mock, 'getUserByEmail').mockImplementation(() => {
				throw new NotFoundException()
			})

			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
			expect(mock.getUserByEmail).toHaveBeenCalledWith('')
		})

		it('should return the user', async () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValue(userModel)

			const email = 'first.last@name.test'
			expect(usecase.handler(email)).resolves.toMatchObject({ email })
			expect(mock.getUserByEmail).toHaveBeenCalledWith(email)
		})
	})
})
