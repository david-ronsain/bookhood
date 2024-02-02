/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common'
import UserModel from '../../../../src/app/domain/models/user.model'
import { UserRepository } from '../../../../src/app//domain/ports/user.repository'
import GetUserByTokenUseCase from '../../../../src/app/application/usecases/getUserByToken.usecase'

describe('GetUserByTokenUseCase', () => {
	let userRepositoryMock: UserRepository
	let getUserByTokenUseCase: GetUserByTokenUseCase

	beforeEach(() => {
		userRepositoryMock = {
			getUserByToken: jest.fn(),
		} as any

		getUserByTokenUseCase = new GetUserByTokenUseCase(userRepositoryMock)
	})

	describe('handler', () => {
		it('should return user when a valid token is provided', async () => {
			const token = 'validToken'
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken'
			).mockResolvedValueOnce(user)

			const result = await getUserByTokenUseCase.handler(token)

			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token
			)
			expect(result).toEqual(user)
		})

		it('should throw NotFoundException when user is not found', async () => {
			const token = 'invalidToken'

			jest.spyOn(
				userRepositoryMock,
				'getUserByToken'
			).mockResolvedValueOnce(null)

			await expect(getUserByTokenUseCase.handler(token)).rejects.toThrow(
				NotFoundException
			)
			expect(userRepositoryMock.getUserByToken).toHaveBeenCalledWith(
				token
			)
		})
	})
})
