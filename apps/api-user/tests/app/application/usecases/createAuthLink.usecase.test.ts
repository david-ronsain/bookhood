/* eslint-disable @nx/enforce-module-boundaries */
import CreateAuthLinkUseCase from '../../../../src/app/application/usecases/createAuthLink.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import {
	userModel,
	userModelWithToken,
	userRepository as userRepo,
} from '../../../../../shared-api/test'

describe('Testing the CreateAuthLinkUseCase', () => {
	let usecase: CreateAuthLinkUseCase

	const mock = {
		...userRepo,
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new CreateAuthLinkUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should create a new token', () => {
			expect(usecase.handler(userModel)).resolves.toMatchObject({
				...userModel,
				token: expect.any(String),
				tokenExpiration: expect.any(Date),
			})
		})

		it('should not create a new token', async () => {
			expect(usecase.handler(userModelWithToken)).resolves.toMatchObject(
				userModelWithToken,
			)
		})
	})
})
