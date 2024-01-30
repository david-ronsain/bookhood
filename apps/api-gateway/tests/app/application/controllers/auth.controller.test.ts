/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { AuthController } from '../../../../src/app/application/controllers/auth.controller'
import { ClientProxy } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src'
import { CreateUserDTO } from '../../../../src/app/application/dto/user.dto'
import { HttpStatus } from '@nestjs/common'
import {
	SendLinkDTO,
	SigninDTO,
} from '../../../../src/app/application/dto/auth.dto'

describe('Testing AuthController', () => {
	let controller: AuthController

	const mock = {
		send: (
			pattern: unknown,
			data: SendLinkDTO | SigninDTO
		): Observable<MicroserviceResponseFormatter<boolean>> => {
			return new Observable<MicroserviceResponseFormatter<boolean>>(
				(subscriber) => {
					if (
						pattern === 'auth-send-link' &&
						(data as SendLinkDTO).email === 'first.last@name.test'
					)
						subscriber.next(
							new MicroserviceResponseFormatter<boolean>(
								true,
								HttpStatus.OK,
								data,
								true
							)
						)
					else if (pattern === 'auth-send-link')
						subscriber.next(
							new MicroserviceResponseFormatter<boolean>(
								false,
								HttpStatus.NOT_FOUND,
								data,
								false
							)
						)
				}
			)
		},
	} as unknown as ClientProxy

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: 'RabbitGateway',
					useValue: mock,
				},
			],
		}).compile()
		controller = module.get<AuthController>(AuthController)
	})

	describe('Testing the sendLink method', () => {
		it('should send the mail', async () => {
			const dto: SendLinkDTO = {
				email: 'first.last@name.test',
			} as SendLinkDTO
			const success = await controller.sendLink(dto as SendLinkDTO)
			expect(success).toBe(true)
		})

		it('should not send the mail because the email does not exist', async () => {
			const dto: SendLinkDTO = {
				email: '',
			}
			expect(controller.sendLink(dto)).rejects.toThrow()
		})
	})
})
