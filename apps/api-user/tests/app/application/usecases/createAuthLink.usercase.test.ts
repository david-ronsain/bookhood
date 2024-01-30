/* eslint-disable @nx/enforce-module-boundaries */
import CreateAuthLinkUseCase from '../../../../src/app/application/usecases/createAuthLink.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import UserModel from '../../../../src/app/domain/models/user.model'
import { ICreateUserDTO } from '../../../../../shared/src'
import { ConflictException } from '@nestjs/common'

describe('Testing the CreateAuthLinkUseCase', () => {
	let usecase: CreateAuthLinkUseCase

	const mock = {
		update: (user: UserModel): Promise<UserModel> =>
			new Promise<UserModel>((resolve) => resolve(user)),
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new CreateAuthLinkUseCase(mock)
	})

	describe('Testing the handler method', () => {
		const user: UserModel = {
			firstName: 'first',
			lastName: 'last',
			email: 'existing@email.test',
		}

		it('should create a new token', () => {
			expect(usecase.handler(user)).resolves.toMatchObject({
				...user,
				token: expect.any(String),
				tokenExpiration: expect.any(Date),
			})
		})

		it('should not create a new token', async () => {
			user.token = 'test'
			user.tokenExpiration = new Date(Date.now() + 1000000)
			expect(usecase.handler(user)).resolves.toMatchObject(user)
		})
	})
})
