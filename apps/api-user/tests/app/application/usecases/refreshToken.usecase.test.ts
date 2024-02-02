/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { Role } from '../../../../../shared/src'
import RefreshTokenUseCase from '../../../../src/app/application/usecases/refreshToken.usecase'
import UserModel from '../../../../src/app/domain/models/user.model'

describe('RefreshTokenUseCase', () => {
	let userRepositoryMock: UserRepository
	let refreshTokenUseCase: RefreshTokenUseCase

	beforeEach(() => {
		userRepositoryMock = {
			getUserByToken: jest.fn(),
			update: jest.fn(),
		} as any

		refreshTokenUseCase = new RefreshTokenUseCase(userRepositoryMock)
	})

	describe('handler', () => {
		it('should refresh token and return user roles', async () => {
			const token = 'validToken'
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
				role: [Role.USER],
				tokenExpiration: new Date(Date.now() - 1000),
			}

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken'
			).mockResolvedValueOnce(user)

			const result = await refreshTokenUseCase.handler(token)

			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token
			)
			expect(userRepositoryMock.update).toHaveBeenCalledWith({
				...user,
				tokenExpiration: expect.any(Date),
			})
			expect(result).toEqual(user.role)
		})

		it('should throw NotFoundException when user is not found', async () => {
			const token = 'invalidToken'

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken'
			).mockResolvedValueOnce(null)

			await expect(refreshTokenUseCase.handler(token)).rejects.toThrow(
				NotFoundException
			)
			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token
			)
			expect(userRepositoryMock.update).not.toHaveBeenCalled()
		})
	})
})
