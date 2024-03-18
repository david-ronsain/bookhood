/* eslint-disable @nx/enforce-module-boundaries */
import { NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../../../src/app//domain/ports/user.repository'
import GetUserByTokenUseCase from '../../../../src/app/application/usecases/getUserByToken.usecase'
import {
	userModel,
	userRepository as userRepo,
} from '../../../../../shared-api/test'

describe('GetUserByTokenUseCase', () => {
	let userRepositoryMock: UserRepository
	let getUserByTokenUseCase: GetUserByTokenUseCase

	beforeEach(() => {
		userRepositoryMock = { ...userRepo } as unknown as UserRepository

		getUserByTokenUseCase = new GetUserByTokenUseCase(userRepositoryMock)
	})

	describe('handler', () => {
		it('should return user when a valid token is provided', async () => {
			const token = 'validToken'

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken',
			).mockResolvedValueOnce(userModel)

			const result = await getUserByTokenUseCase.handler(token)

			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token,
			)
			expect(result).toMatchObject(userModel)
		})

		it('should throw NotFoundException when user is not found', async () => {
			const token = 'invalidToken'

			jest.spyOn(userRepositoryMock, 'getUserByToken').mockImplementation(
				() => {
					throw new NotFoundException()
				},
			)

			await expect(getUserByTokenUseCase.handler(token)).rejects.toThrow(
				NotFoundException,
			)
			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token,
			)
		})
	})
})
