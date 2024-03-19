/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException, HttpStatus } from '@nestjs/common'
import { AuthController } from '../../../../src/app/application/controllers/auth.controller'
import {
	SendLinkDTO,
	SigninDTO,
} from '../../../../src/app/application/dto/auth.dto'
import { UserNotFoundException } from '../../../../src/app/application/exceptions'
import { of } from 'rxjs'
import {
	MQAuthMessageType,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src'
import { Locale } from '../../../../../shared/src'

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
				of(response),
			)

			const result = await controller.sendLink(sendLinkDTO, Locale.FR)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQAuthMessageType.SEND_LINK,
				{ ...sendLinkDTO, session: { locale: Locale.FR } },
			)
			expect(result).toBe(true)
		})

		it('should handle user not found exception', async () => {
			const sendLinkDTO: SendLinkDTO = {
				email: 'first.last@name.test',
			}

			const response = new MicroserviceResponseFormatter(
				false,
				HttpStatus.NOT_FOUND,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.sendLink(sendLinkDTO, Locale.FR),
			).rejects.toThrow(UserNotFoundException)
		})
	})

	describe('signin', () => {
		it('should authenticate the user', async () => {
			const signinDTO: SigninDTO = {
				token: 'mytoken',
			}

			const response = new MicroserviceResponseFormatter(true)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.signin(signinDTO, Locale.FR)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQAuthMessageType.SIGNIN,
				{ ...signinDTO, session: { locale: Locale.FR } },
			)
			expect(result).toBe(true)
		})

		it('should handle forbidden exception', async () => {
			const signinDTO: SigninDTO = {
				token: 'mytoken',
			}

			const response = new MicroserviceResponseFormatter(
				false,
				HttpStatus.FORBIDDEN,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.signin(signinDTO, Locale.FR),
			).rejects.toThrow(ForbiddenException)
		})
	})
})
