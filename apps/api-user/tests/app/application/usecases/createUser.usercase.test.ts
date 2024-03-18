/* eslint-disable @nx/enforce-module-boundaries */
import CreateUserUseCase from '../../../../src/app/application/usecases/createUser.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import { ICreateUserDTO } from '../../../../../shared/src'
import { ConflictException } from '@nestjs/common'
import {
	userEntity,
	userRepository as userRepo,
} from '../../../../../shared-api/test'

describe('Testing the CreateUserUseCase', () => {
	let usecase: CreateUserUseCase

	const mock = {
		...userRepo,
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new CreateUserUseCase(mock)
	})

	describe('Testing the handler method', () => {
		const dto: ICreateUserDTO = {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		}

		it('should not create an user because the email already exists', () => {
			jest.spyOn(mock, 'emailExists').mockResolvedValue(true)

			expect(usecase.handler(dto)).rejects.toThrow(ConflictException)
		})

		it('should create the user', async () => {
			jest.spyOn(mock, 'emailExists').mockResolvedValue(false)
			jest.spyOn(mock, 'createUser').mockResolvedValue(userEntity)

			const created = await usecase.handler(dto)
			expect(created.email).toBe(dto.email)
		})
	})
})
