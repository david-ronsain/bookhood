/* eslint-disable @nx/enforce-module-boundaries */
import VerifAuthTokenUseCase from '../../../../src/app/application/usecases/verifyAuthToken.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import {
	userModelWithToken,
	userRepository as userRepo,
} from '../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('Testing the VerifAuthTokenUseCase', () => {
	let usecase: VerifAuthTokenUseCase
	let i18n: I18nService

	let mock: UserRepository

	beforeEach(async () => {
		mock = { ...userRepo } as unknown as UserRepository
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		usecase = new VerifAuthTokenUseCase(mock, i18n)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	describe('Testing the handler method', () => {
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

		it('should throw an error if the token has expired', async () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValue({
				...userModelWithToken,
				tokenExpiration: new Date(Date.now() - 1),
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
