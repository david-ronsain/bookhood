/* eslint-disable @nx/enforce-module-boundaries */
import CreateUserUseCase from '../../../../src/app/application/usecases/createUser.usecase'
import { UserRepository } from '../../../../src/app/domain/ports/user.repository'
import UserModel from '../../../../src/app/domain/models/user.model'
import { ICreateUserDTO } from '../../../../../shared/src'
import { ConflictException } from '@nestjs/common'

describe('Testing the CreateUserUseCase', () => {
	let usecase: CreateUserUseCase

	const mock = {
		createUser: (user: UserModel): Promise<UserModel> =>
			new Promise<UserModel>((resolve) => resolve(user)),
		emailExists: (email: string): Promise<boolean> =>
			new Promise<boolean>((resolve) =>
				resolve(email === 'existing@email.test')
			),
	} as unknown as UserRepository

	beforeEach(async () => {
		usecase = new CreateUserUseCase(mock)
	})

	describe('Testing the handler method', () => {
		const dto: ICreateUserDTO = {
			firstName: 'first',
			lastName: 'last',
			email: 'existing@email.test',
		}

		it('should not create an user because the email already exists', () => {
			expect(usecase.handler(dto)).rejects.toThrow(ConflictException)
		})

		it('should create the user', async () => {
			dto.email = 'first.last@name.test'
			const created = await usecase.handler(dto)
			expect(created.email).toBe(dto.email)
		})
	})
})
