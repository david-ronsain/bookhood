/* eslint-disable @nx/enforce-module-boundaries */
import VerifAuthTokenUseCase from '../../../../src/app/application/usecases/verifyAuthToken.usecase'
import UserModel from '../../../../src/app/domain/models/user.model'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

describe('Testing the VerifAuthTokenUseCase', () => {
	let usecase: VerifAuthTokenUseCase

	const mock = {
		getUserByEmail: (email: string): Promise<UserModel | null> =>
			new Promise<UserModel | null>((resolve) => {
				if (email === '') resolve(null)
				else if (email === 'incorrectToken')
					resolve({
						email,
						token: '',
						tokenExpiration: new Date(Date.now() + 10000),
					} as UserModel)
				else if (email === 'expiredToken')
					resolve({
						email,
						token: '|a',
						tokenExpiration: new Date(Date.now() - 10000),
					} as UserModel)
				else
					resolve({
						email,
						token: '|s',
						tokenExpiration: new Date(Date.now() + 10000),
					} as UserModel)
			}),
		update: (user: UserModel): Promise<UserModel> => Promise.resolve(user),
	} as unknown as UserRepository

	beforeEach(async () => {
		jest.resetAllMocks()
		usecase = new VerifAuthTokenUseCase(mock)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			expect(usecase.handler('', '')).rejects.toThrow(NotFoundException)
		})

		it('should throw an error if the token is incorrect', () => {
			expect(usecase.handler('incorrectToken', 'a')).rejects.toThrow(
				ForbiddenException
			)
		})

		it('should throw an error if the token has expired', () => {
			expect(usecase.handler('expiredToken', 'a')).rejects.toThrow(
				ForbiddenException
			)
		})

		it('should return validate the token', async () => {
			expect(usecase.handler('first.last@name.test', 's')).resolves.toBe(
				true
			)
		})
	})
})
