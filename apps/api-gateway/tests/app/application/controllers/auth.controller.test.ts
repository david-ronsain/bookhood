/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import {
	BadRequestException,
	ForbiddenException,
	HttpStatus,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { AuthController } from '../../../../src/app/application/controllers/auth.controller'
import {
	SendLinkDTO,
	SigninDTO,
} from '../../../../src/app/application/dto/auth.dto'
import { UserNotFoundException } from '../../../../src/app/application/exceptions'
import { of } from 'rxjs'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'

jest.mock('@nestjs/microservices', () => ({
	ClientProxy: {
		send: jest.fn(() => of({})),
	},
}))

describe('AuthController', () => {
	let controller: AuthController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: 'RabbitUser',
					useValue: {
						send: jest.fn(() => of({})),
					},
				},
			],
		}).compile()

		controller = module.get<AuthController>(AuthController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('sendLink', () => {
		it('should send a login link', async () => {
			const sendLinkDTO: SendLinkDTO = {
				email: 'first.last@name.test',
			}

			const response = new MicroserviceResponseFormatter<boolean>(true)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response)
			)

			const result = await controller.sendLink(sendLinkDTO)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				'auth-send-link',
				sendLinkDTO
			)
			expect(result).toBe(true)
		})

		it('should handle user not found exception', async () => {
			const sendLinkDTO: SendLinkDTO = {
				email: 'first.last@name.test',
			}

			const response = new MicroserviceResponseFormatter(
				false,
				HttpStatus.NOT_FOUND
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response)
			)

			await expect(controller.sendLink(sendLinkDTO)).rejects.toThrow(
				UserNotFoundException
			)
		})
	})

	describe('signin', () => {
		it('should authenticate the user', async () => {
			const signinDTO: SigninDTO = {
				token: 'mytoken',
			}

			const response = new MicroserviceResponseFormatter(true)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response)
			)

			const result = await controller.signin(signinDTO)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				'auth-signin',
				signinDTO
			)
			expect(result).toBe(true)
		})

		it('should handle forbidden exception', async () => {
			const signinDTO: SigninDTO = {
				token: 'mytoken',
			}

			const response = new MicroserviceResponseFormatter(
				false,
				HttpStatus.FORBIDDEN
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response)
			)

			await expect(controller.signin(signinDTO)).rejects.toThrow(
				ForbiddenException
			)
		})
	})
})
