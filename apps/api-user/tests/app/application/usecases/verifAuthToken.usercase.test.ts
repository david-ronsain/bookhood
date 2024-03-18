/* eslint-disable @nx/enforce-module-boundaries */
import VerifAuthTokenUseCase from '../../../../src/app/application/usecases/verifyAuthToken.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import {
	userModelWithToken,
	userRepository as userRepo,
} from '../../../../../shared-api/test'

describe('Testing the VerifAuthTokenUseCase', () => {
	let usecase: VerifAuthTokenUseCase

	let mock: UserRepository

	beforeEach(async () => {
		mock = { ...userRepo } as unknown as UserRepository

		usecase = new VerifAuthTokenUseCase(mock)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValueOnce(null)

			expect(usecase.handler('', '')).rejects.toThrow(NotFoundException)
			expect(mock.getUserByEmail).toHaveBeenCalledWith('')
		})

		it('should throw an error if the token is incorrect', () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValueOnce({
				...userModelWithToken,
			})
			jest.spyOn(mock, 'update').mockResolvedValueOnce({
				...userModelWithToken,
			})

			expect(
				usecase.handler(userModelWithToken.email, 'a'),
			).rejects.toThrow(ForbiddenException)
			expect(mock.getUserByEmail).toHaveBeenCalledWith(
				userModelWithToken.email,
			)
		})

		it('should throw an error if the token has expired', () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValue({
				...userModelWithToken,
				tokenExpiration: new Date(),
			})
			jest.spyOn(mock, 'update').mockResolvedValueOnce({
				...userModelWithToken,
			})

			expect(
				usecase.handler(
					userModelWithToken.email,
					userModelWithToken.token.split('|')[1],
				),
			).rejects.toThrow(ForbiddenException)
			expect(mock.getUserByEmail).toHaveBeenCalledWith(
				userModelWithToken.email,
			)
		})

		it('should return validate the token', async () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValue({
				...userModelWithToken,
			})
			jest.spyOn(mock, 'update')

			expect(
				usecase.handler(
					userModelWithToken.email,
					userModelWithToken.token.split('|')[1],
				),
			).resolves.toBe(true)
			expect(mock.getUserByEmail).toHaveBeenCalledWith(
				userModelWithToken.email,
			)
		})
	})
})
