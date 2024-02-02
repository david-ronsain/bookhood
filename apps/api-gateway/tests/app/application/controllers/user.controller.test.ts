/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { UserController } from '../../../../src/app/application/controllers/user.controller'
import { ClientProxy } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/'
import { CreateUserDTO } from '../../../../src/app/application/dto/user.dto'
import { HttpStatus } from '@nestjs/common'

describe('Testing UserController', () => {
	let controller: UserController

	const mock = {
		send: (
			pattern: unknown,
			data: CreateUserDTO
		): Observable<MicroserviceResponseFormatter<CreateUserDTO>> => {
			return new Observable<MicroserviceResponseFormatter<CreateUserDTO>>(
				(subscriber) => {
					if (data.email === 'first.last@name.test')
						subscriber.next(
							new MicroserviceResponseFormatter(
								true,
								HttpStatus.CREATED,
								data,
								data
							)
						)
					else
						subscriber.next(
							new MicroserviceResponseFormatter(
								false,
								HttpStatus.CONFLICT,
								data,
								data
							)
						)
				}
			)
		},
	} as unknown as ClientProxy

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: 'RabbitUser',
					useValue: mock,
				},
			],
		}).compile()
		controller = module.get<UserController>(UserController)
	})

	it('should create an user', async () => {
		const userToCreate: CreateUserDTO = {
			email: 'first.last@name.test',
			firstName: 'first',
			lastName: 'last',
		}
		const user = await controller.createUser(userToCreate)
		expect(user.email).toBe(userToCreate.email)
	})

	it('should not create an user', async () => {
		const userToCreate: CreateUserDTO = {
			email: '',
			firstName: '',
			lastName: '',
		}
		expect(controller.createUser(userToCreate)).rejects.toThrow()
	})
})
