/* eslint-disable @nx/enforce-module-boundaries */
import GetUserByEmailUseCase from '../../../../src/app/application/usecases/getUserByEmail.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import UserModel from '../../../../src/app/domain/models/user.model'
import { NotFoundException } from '@nestjs/common'

describe('Testing the GetUserByEmailUseCase', () => {
	let usecase: GetUserByEmailUseCase

	const mock = {
		getUserByEmail: (email: string): Promise<UserModel | null> =>
			new Promise<UserModel | null>((resolve) =>
				resolve(email === '' ? null : ({ email } as UserModel))
			),
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new GetUserByEmailUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
		})

		it('should return the user', async () => {
			const email = 'first.last@name.test'
			expect(usecase.handler(email)).resolves.toMatchObject({ email })
		})
	})
})
