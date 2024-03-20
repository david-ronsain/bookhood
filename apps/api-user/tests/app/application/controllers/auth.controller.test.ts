/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { AuthController } from '../../../../src/app/application/controllers/auth.controller'
import { winstonConfig } from '../../../../../shared/src'
import { HttpStatus, NotFoundException } from '@nestjs/common'
import * as winston from 'winston'
import { WinstonModule } from 'nest-winston'
import envConfig from '../../../../src/config/env.config'
import { of } from 'rxjs'
import GetUserByEmailUseCase from '../../../../src/app/application/usecases/getUserByEmail.usecase'
import CreateAuthLinkUseCase from '../../../../src/app/application/usecases/createAuthLink.usecase'
import VerifyAuthTokenUseCase from '../../../../src/app/application/usecases/verifyAuthToken.usecase'
import { HealthCheckStatus } from '../../../../../shared-api/src'
import { userModel } from '../../../../../shared-api/test'
import { ClientProxy } from '@nestjs/microservices'
import { I18nService } from 'nestjs-i18n'

jest.mock('rxjs', () => ({
	of: jest.fn(),
	firstValueFrom: () => Promise.resolve(),
}))

describe('Testing AuthController', () => {
	let controller: AuthController
	let getUserByEmailUseCase: GetUserByEmailUseCase
	let createAuthLinkUseCase: CreateAuthLinkUseCase
	let verifyAuthTokenUseCase: VerifyAuthTokenUseCase
	let rabbitMailClientMock: ClientProxy

	beforeEach(async () => {
		jest.clearAllMocks()

		rabbitMailClientMock = {
			send: jest.fn(() => of(null)),
		} as unknown as ClientProxy

		const module = await Test.createTestingModule({
			imports: [
				WinstonModule.forRoot(
					winstonConfig(
						winston,
						envConfig().gateway.user.serviceName,
					),
				),
			],
			controllers: [AuthController],
			providers: [
				{
					provide: 'RabbitMail',
					useValue: rabbitMailClientMock,
				},
				{
					provide: GetUserByEmailUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: CreateAuthLinkUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: VerifyAuthTokenUseCase,
					useValue: {
						handler: jest.fn(),
					},
				},
				{
					provide: I18nService,
					useValue: {
						t: jest.fn(),
					},
				},
			],
		}).compile()
		controller = module.get<AuthController>(AuthController)
		getUserByEmailUseCase = module.get<GetUserByEmailUseCase>(
			GetUserByEmailUseCase,
		)
		createAuthLinkUseCase = module.get<CreateAuthLinkUseCase>(
			CreateAuthLinkUseCase,
		)
		verifyAuthTokenUseCase = module.get<VerifyAuthTokenUseCase>(
			VerifyAuthTokenUseCase,
		)
	})

	describe('The healthcheck', () => {
		it('should return "up"', () => {
			expect(controller.health()).toBe(HealthCheckStatus.UP)
		})
	})

	describe('sendLink method', () => {
		it('should send the signin link', async () => {
			jest.spyOn(getUserByEmailUseCase, 'handler').mockResolvedValue(
				userModel,
			)

			jest.spyOn(rabbitMailClientMock, 'send').mockReturnValue({
				subscribe: jest.fn(() => of({})),
			} as any)

			const result = await controller.sendLink({
				email: 'first.last@name.test',
			})

			expect(getUserByEmailUseCase.handler).toHaveBeenCalledWith(
				'first.last@name.test',
			)
			expect(rabbitMailClientMock.send).toHaveBeenCalled()

			expect(result).toMatchObject({
				success: true,
				code: HttpStatus.OK,
			})
		})

		it('should fail to send the link', async () => {
			jest.spyOn(getUserByEmailUseCase, 'handler').mockImplementationOnce(
				() => {
					throw new NotFoundException()
				},
			)
			expect(controller.sendLink({ email: '' })).resolves.toMatchObject({
				success: false,
			})
		})
	})

	describe('signin method', () => {
		it('should validate the authentication', async () => {
			jest.spyOn(verifyAuthTokenUseCase, 'handler').mockResolvedValue(
				true,
			)

			expect(
				controller.signin({ token: 'test|test' }),
			).resolves.toMatchObject({ success: true })
		})

		it('should reject the incorrect token', async () => {
			expect(controller.signin({ token: 'test' })).resolves.toMatchObject(
				{ success: false },
			)
		})

		it('should reject the token because the email does not exist', async () => {
			jest.spyOn(verifyAuthTokenUseCase, 'handler').mockImplementation(
				() => {
					throw new Error()
				},
			)

			expect(controller.signin({ token: '|' })).resolves.toMatchObject({
				success: false,
			})
		})
	})
})
