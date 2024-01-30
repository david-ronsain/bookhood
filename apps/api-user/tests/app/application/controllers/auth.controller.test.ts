/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { AuthController } from '../../../../src/app/application/controllers/auth.controller'
import CreateUserUseCase from '../../../../src/app/application/usecases/createUser.usecase'
import {
	ICreateUserDTO,
	ISendLinkDTO,
	winstonConfig,
} from '../../../../../shared/src'
import UserModel from '../../../../src/app/domain/models/user.model'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import {
	ConflictException,
	HttpStatus,
	NotFoundException,
} from '@nestjs/common'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import * as winston from 'winston'
import { WinstonModule } from 'nest-winston'
import envConfig from '../../../../src/config/env.config'
import { Observable } from 'rxjs'
import GetUserByEmailUseCase from '../../../../src/app/application/usecases/getUserByEmail.usecase'
import CreateAuthLinkUseCase from '../../../../src/app/application/usecases/createAuthLink.usecase'
import VerifyAuthTokenUseCase from '../../../../src/app/application/usecases/verifyAuthToken.usecase'

const moduleMocker = new ModuleMocker(global)
describe('Testing AuthController', () => {
	let controller: AuthController

	const mockGetUserByEmailUseCase = {
		handler: (email: string): Promise<UserModel> =>
			new Promise((resolve) => {
				if (email === '') {
					throw new NotFoundException('error')
				}
				resolve(
					new UserModel({
						firstName: 'first',
						lastName: 'lastName',
						email: 'first.last@name.test',
					})
				)
			}),
	} as unknown as GetUserByEmailUseCase
	const mockCreateAuthLinkUseCase = {
		handler: (user: UserModel): Promise<UserModel> =>
			new Promise((resolve) => resolve(user)),
	} as unknown as CreateAuthLinkUseCase
	const mockVerifyAuthTokenUseCase = {
		handler: (email: string, token: string): Promise<boolean> =>
			new Promise((resolve) => {
				if (email === '') {
					throw new NotFoundException('error')
				}
				resolve(true)
			}),
	} as unknown as VerifyAuthTokenUseCase

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [
				WinstonModule.forRoot(
					winstonConfig(winston, envConfig().gateway.user.serviceName)
				),
			],
			controllers: [AuthController],
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
				if (token === GetUserByEmailUseCase) {
					return mockGetUserByEmailUseCase
				} else if (token === CreateAuthLinkUseCase) {
					return mockCreateAuthLinkUseCase
				} else if (token === VerifyAuthTokenUseCase) {
					return mockVerifyAuthTokenUseCase
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
		controller = module.get<AuthController>(AuthController)
	})

	describe('The healthcheck', () => {
		it('should return "up"', () => {
			expect(controller.health()).toBe('up')
		})
	})

	describe('sendLink method', () => {
		it('should send the signin link', async () => {
			expect(
				controller.sendLink({ email: 'first.last@name.test' })
			).resolves.toMatchObject({
				success: true,
				code: HttpStatus.OK,
			})
		})

		it('should fail to send the link', async () => {
			expect(controller.sendLink({ email: '' })).resolves.toMatchObject({
				success: false,
			})
		})
	})

	describe('signin method', () => {
		it('should validate the authentication', async () => {
			expect(
				controller.signin({ token: 'test|test' })
			).resolves.toMatchObject({ success: true })
		})

		it('should reject the incorrect token', async () => {
			expect(controller.signin({ token: 'test' })).resolves.toMatchObject(
				{ success: false }
			)
		})

		it('should reject the token because the email does not exist', async () => {
			expect(controller.signin({ token: '|' })).resolves.toMatchObject({
				success: false,
			})
		})
	})
})
