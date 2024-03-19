/* eslint-disable @nx/enforce-module-boundaries */
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { NotFoundException } from '@nestjs/common'
import GetUserByIdUseCase from '../../../../src/app/application/usecases/getUserById.usecase'
import {
	userModel,
	userRepository as userRepo,
} from '../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('Testing the GetUserByIdUseCase', () => {
	let usecase: GetUserByIdUseCase
	let i18n: I18nService

	const mock = { ...userRepo } as unknown as UserRepository

	beforeEach(async () => {
		jest.clearAllMocks()
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		usecase = new GetUserByIdUseCase(mock, i18n)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			jest.spyOn(mock, 'getUserById').mockImplementation(() => {
				throw new NotFoundException()
			})

			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
			expect(mock.getUserById).toHaveBeenCalledWith('')
		})

		it('should return the user', async () => {
			jest.spyOn(mock, 'getUserById').mockResolvedValue(userModel)

			expect(usecase.handler(userModel._id)).resolves.toMatchObject(
				userModel,
			)
			expect(mock.getUserById).toHaveBeenCalledWith(userModel._id)
		})
	})
})
