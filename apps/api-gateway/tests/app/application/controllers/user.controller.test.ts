/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '../../../../src/app/application/controllers/user.controller'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, of } from 'rxjs'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/'
import { CreateUserDTO } from '../../../../src/app/application/dto/user.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import { IUser } from '../../../../../shared/src'
import { UserNotFoundException } from '../../../../src/app/application/exceptions'

jest.mock('@nestjs/microservices', () => ({
	ClientProxy: jest.fn(() => ({
		send: jest.fn(),
	})),
}))

describe('Testing UserController', () => {
	let controller: UserController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: 'RabbitUser',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
			],
		}).compile()

		controller = module.get<UserController>(UserController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('create', () => {
		it('should create an user', async () => {
			const userToCreate: CreateUserDTO = {
				email: 'first.last@name.test',
				firstName: 'first',
				lastName: 'last',
			}

			const response = new MicroserviceResponseFormatter<CreateUserDTO>(
				true,
				HttpStatus.CREATED,
				{},
				userToCreate,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.createUser(userToCreate)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				'user-create',
				userToCreate,
			)

			expect(result).toMatchObject(userToCreate)
		})

		it('should throw an error if the microservice returns an error', async () => {
			const userToCreate: CreateUserDTO = {
				email: '',
				firstName: '',
				lastName: '',
			}

			const response = new MicroserviceResponseFormatter<CreateUserDTO>(
				false,
				HttpStatus.BAD_REQUEST,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(controller.createUser(userToCreate)).rejects.toThrow(
				HttpException,
			)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				'user-create',
				userToCreate,
			)
		})
	})

	describe('me', () => {
		it("should return the current user's data", async () => {
			const token = 'oibgeogezgz|iogbgzegbez.ezgz'
			const user = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}

			const response = new MicroserviceResponseFormatter<IUser>(
				true,
				HttpStatus.OK,
				{},
				user,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getProfile(token)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				'user-get-profile',
				token,
			)

			expect(result).toMatchObject(user)
		})

		it('should throw an error if no token is provided', async () => {
			await expect(controller.getProfile()).rejects.toThrow(
				UserNotFoundException,
			)
		})

		it('should throw an error if the microservice returns an error', async () => {
			const inputToken = 'oibgeogezgz|iogbgzegbez.ezgz|gezg'
			const token = 'oibgeogezgz|iogbgzegbez.ezgz'

			const response = new MicroserviceResponseFormatter<IUser>(
				false,
				HttpStatus.NOT_FOUND,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(controller.getProfile(inputToken)).rejects.toThrow(
				UserNotFoundException,
			)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				'user-get-profile',
				token,
			)
		})
	})
})
