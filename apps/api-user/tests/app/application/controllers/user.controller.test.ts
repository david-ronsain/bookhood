/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { UserController } from '../../../../src/app/application/controllers/user.controller'
import CreateUserUseCase from '../../../../src/app/application/usecases/createUser.usecase'
import { ICreateUserDTO, winstonConfig } from '../../../../../shared/src'
import UserModel from '../../../../src/app/domain/models/user.model'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import { ConflictException, HttpStatus } from '@nestjs/common'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import * as winston from 'winston'
import { WinstonModule } from 'nest-winston'
import envConfig from '../../../../src/config/env.config'
import { Observable } from 'rxjs'

const moduleMocker = new ModuleMocker(global)
describe('Testing UserController', () => {
	let controller: UserController

	const mock = {
		handler: (user: ICreateUserDTO): Promise<UserModel> =>
			new Promise((resolve) => {
				if (user.email === '') {
					throw new ConflictException('error')
				}
				resolve(new UserModel(user))
			}),
	} as unknown as CreateUserUseCase

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [
				WinstonModule.forRoot(
					winstonConfig(winston, envConfig().gateway.user.serviceName)
				),
			],
			controllers: [UserController],
			providers: [
				{
					provide: 'RabbitMail',
					useValue: {
						send: () => new Observable(),
					},
				},
			],
		})
			.useMocker((token) => {
				if (token === CreateUserUseCase) {
					return mock
				}
				if (typeof token === 'function') {
					const mockMetadata = moduleMocker.getMetadata(
						token
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					) as MockFunctionMetadata<any, any>
					const Mock = moduleMocker.generateFromMetadata(mockMetadata)
					return new Mock()
				}
			})
			.compile()
		controller = module.get<UserController>(UserController)
	})

	describe('The healthcheck', () => {
		it('should return "up"', () => {
			expect(controller.health()).toBe('up')
		})
	})

	describe('createUser method', () => {
		it('should create the user', async () => {
			const userToCreate = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}
			const expectedResponse = new MicroserviceResponseFormatter(
				true,
				HttpStatus.CREATED,
				undefined,
				userToCreate
			)
			expect(controller.createUser(userToCreate)).resolves.toMatchObject(
				expectedResponse
			)
		})

		it('should fail to create the user', async () => {
			const userToCreate = {
				firstName: '',
				lastName: '',
				email: '',
			}
			const expectedResponse = new MicroserviceResponseFormatter(
				false,
				HttpStatus.CONFLICT,
				userToCreate
			)
			expect(controller.createUser(userToCreate)).resolves.toMatchObject(
				expectedResponse
			)
		})
	})
})
