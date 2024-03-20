/* eslint-disable @nx/enforce-module-boundaries */
import { NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import RefreshTokenUseCase from '../../../../src/app/application/usecases/refreshToken.usecase'
import {
	userModel,
	userRepository as userRepo,
} from '../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('RefreshTokenUseCase', () => {
	let userRepositoryMock: UserRepository
	let refreshTokenUseCase: RefreshTokenUseCase
	let i18n: I18nService

	beforeEach(() => {
		jest.clearAllMocks()
		userRepositoryMock = { ...userRepo } as unknown as UserRepository
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		refreshTokenUseCase = new RefreshTokenUseCase(userRepositoryMock, i18n)
	})

	describe('handler', () => {
		it('should refresh token and return user roles', async () => {
			const token = 'validToken'

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken',
			).mockResolvedValueOnce(userModel)

			const result = await refreshTokenUseCase.handler(token)

			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token,
			)
			expect(userRepositoryMock.update).toHaveBeenCalledWith({
				...userModel,
				tokenExpiration: expect.any(Date),
			})
			expect(result).toEqual(userModel.role)
		})

		it('should throw NotFoundException when user is not found', async () => {
			const token = 'invalidToken'

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken',
			).mockResolvedValueOnce(null)

			await expect(refreshTokenUseCase.handler(token)).rejects.toThrow(
				NotFoundException,
			)
			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token,
			)
			expect(userRepositoryMock.update).not.toHaveBeenCalled()
		})
	})
})
