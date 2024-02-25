/* eslint-disable @nx/enforce-module-boundaries */
import GetUserByEmailUseCase from '../../../../src/app/application/usecases/getUserByEmail.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import UserModel from '../../../../src/app/domain/models/user.model'
import { NotFoundException } from '@nestjs/common'
import GetUserByIdUseCase from '../../../../src/app/application/usecases/getUserById.usecase'

describe('Testing the GetUserByIdUseCase', () => {
	let usecase: GetUserByIdUseCase

	const mock = {
		getUserById: (userId: string): Promise<UserModel | null> =>
			new Promise<UserModel | null>((resolve) =>
				resolve(userId === '' ? null : ({ _id: userId } as UserModel)),
			),
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new GetUserByIdUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
		})

		it('should return the user', async () => {
			const id = 'aaaa'
			expect(usecase.handler(id)).resolves.toMatchObject({ _id: id })
		})
	})
})
