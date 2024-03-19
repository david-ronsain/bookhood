/* eslint-disable @nx/enforce-module-boundaries */
import GetUserByEmailUseCase from '../../../../src/app/application/usecases/getUserByEmail.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { NotFoundException } from '@nestjs/common'
import {
	userModel,
	userRepository as userRepo,
} from '../../../../../shared-api/test'
import { I18nService } from 'nestjs-i18n'

describe('Testing the GetUserByEmailUseCase', () => {
	let usecase: GetUserByEmailUseCase
	let i18n: I18nService

	const mock = { ...userRepo } as unknown as UserRepository

	beforeEach(async () => {
		i18n = {
			t: jest.fn(),
		} as unknown as I18nService

		usecase = new GetUserByEmailUseCase(mock, i18n)
	})

	describe('Testing the handler method', () => {
		it('should throw an error if the user does not exist', () => {
			jest.spyOn(mock, 'getUserByEmail').mockImplementation(() => {
				throw new NotFoundException()
			})

			expect(usecase.handler('')).rejects.toThrow(NotFoundException)
			expect(mock.getUserByEmail).toHaveBeenCalledWith('')
		})

		it('should return the user', async () => {
			jest.spyOn(mock, 'getUserByEmail').mockResolvedValue(userModel)

			const email = 'first.last@name.test'
			expect(usecase.handler(email)).resolves.toMatchObject({ email })
			expect(mock.getUserByEmail).toHaveBeenCalledWith(email)
		})
	})
})
