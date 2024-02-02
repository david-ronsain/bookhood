/* eslint-disable @nx/enforce-module-boundaries */
import UserEmailExistsUseCase from '../../../../src/app/application/usecases/userEmailExists.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { NotFoundException } from '@nestjs/common'

describe('Testing the UserEmailExistsUseCase', () => {
	let usecase: UserEmailExistsUseCase

	const mock = {
		emailExists: (email: string): Promise<boolean> =>
			new Promise<boolean>((resolve) => resolve(email !== '')),
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new UserEmailExistsUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
		})

		it('should return the user', async () => {
			const email = 'first.last@name.test'
			expect(usecase.handler(email)).resolves.toBe(true)
		})
	})
})
