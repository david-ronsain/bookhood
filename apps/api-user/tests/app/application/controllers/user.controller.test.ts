/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import CreateAuthLinkUseCase from '../../../../src/app/application/usecases/createAuthLink.usecase'
import GetUserByTokenUseCase from '../../../../src/app/application/usecases/getUserByToken.usecase'
import RefreshTokenUseCase from '../../../../src/app/application/usecases/refreshToken.usecase'
import CreateUserUseCase from '../../../../src/app/application/usecases/createUser.usecase'
import { UserController } from '../../../../src/app/application/controllers/user.controller'
import UserModel from '../../../../src/app/domain/models/user.model'
import { MicroserviceResponseFormatter } from '../../../../../shared-api/src/formatters/microserviceResponse.formatter'
import {
	ICreateUserDTO,
	IExternalProfile,
	IUser,
	Role,
} from '../../../../../shared/src'
import { of, Observable } from 'rxjs'
import GetUserByIdUseCase from '../../../../src/app/application/usecases/getUserById.usecase'
import { GetProfileDTO } from '../../../../src/app/application/dto/user.dto'

jest.mock('rxjs', () => ({
	of: jest.fn(),
}))

describe('UserController', () => {
	let controller: UserController
	let loggerMock: Logger
	let rabbitMailClientMock: ClientProxy
	let mockedUseCase

	beforeEach(async () => {
		loggerMock = {
			error: jest.fn(),
			info: jest.fn(),
			debug: jest.fn(),
		} as any

		rabbitMailClientMock = {
			send: jest.fn(() => of(null)),
		} as any

		mockedUseCase = {
			handler: jest.fn(),
		} as any
		;(of as jest.Mock).mockReturnValue(of(null))

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{ provide: WINSTON_MODULE_PROVIDER, useValue: loggerMock },
				{ provide: 'RabbitMail', useValue: rabbitMailClientMock },
				{
					provide: CreateAuthLinkUseCase,
					useValue: mockedUseCase,
				},
				{
					provide: GetUserByTokenUseCase,
					useValue: mockedUseCase,
				},
				{
					provide: RefreshTokenUseCase,
					useValue: mockedUseCase,
				},
				{ provide: CreateUserUseCase, useValue: mockedUseCase },
				{ provide: GetUserByIdUseCase, useValue: mockedUseCase },
			],
		}).compile()

		controller = module.get<UserController>(UserController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('health', () => {
		it('should return "up"', () => {
			const result = controller.health()
			expect(result).toBe('up')
		})
	})

	describe('createUser', () => {
		it('should create user and send registration email', async () => {
			const mockObservable: Observable<any> = of({})
			const createUserDTO: ICreateUserDTO = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@email.test',
			}

			jest.spyOn(mockedUseCase, 'handler').mockResolvedValue(
				createUserDTO,
			)
			jest.spyOn(mockedUseCase, 'handler').mockImplementationOnce(() =>
				Promise.resolve(createUserDTO),
			)
			jest.spyOn(rabbitMailClientMock, 'send').mockReturnValue({
				subscribe: jest.fn(() => mockObservable),
			} as any)

			const result = await controller.createUser(createUserDTO)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(createUserDTO)
			expect(mockedUseCase.handler).toHaveBeenCalledWith(createUserDTO)
			expect(rabbitMailClientMock.send).toHaveBeenCalledWith(
				'mail-user-registered',
				createUserDTO,
			)

			expect(result).toEqual(
				new MicroserviceResponseFormatter<UserModel>(
					true,
					HttpStatus.CREATED,
					undefined,
					createUserDTO,
				),
			)
		})

		it('should handle errors during user creation', async () => {
			const createUserDTO = {
				firstName: '',
				lastName: '',
				email: '',
			}
			const error = new Error('User creation error')

			jest.spyOn(mockedUseCase, 'handler').mockRejectedValue(error)

			const result = await controller.createUser(createUserDTO)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(createUserDTO)

			expect(result).toEqual(
				new MicroserviceResponseFormatter<UserModel>().buildFromException(
					error,
					createUserDTO,
				),
			)
		})
	})

	describe('getRoleByEmail', () => {
		it('should get user roles by token', async () => {
			const token = 'someToken'
			const roles: Role[] = [Role.USER]

			jest.spyOn(mockedUseCase, 'handler').mockResolvedValue(roles)

			const result = await controller.getRoleByEmail(token)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(token)
			expect(result).toEqual(roles)
		})

		it('should handle not found exception', async () => {
			const token = 'someToken'
			const error = new NotFoundException('user not found')

			jest.spyOn(mockedUseCase, 'handler').mockRejectedValue(error)

			const result = await controller.getRoleByEmail(token)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(token)
			expect(loggerMock.error).toHaveBeenCalledWith(error)
			expect(result).toEqual([Role.GUEST])
		})
	})

	describe('getByToken', () => {
		it('should get user by token', async () => {
			const token = 'someToken'
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@email.test',
			}

			jest.spyOn(mockedUseCase, 'handler').mockResolvedValue(user)

			const result = await controller.getByToken(token)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(token)
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IUser | null>(
					true,
					HttpStatus.CREATED,
					undefined,
					user,
				),
			)
		})

		it('should handle errors during user retrieval', async () => {
			const token = 'someToken'
			const error = new Error('User retrieval error')

			jest.spyOn(mockedUseCase, 'handler').mockRejectedValue(error)

			const result = await controller.getByToken(token)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(token)

			expect(result).toEqual(
				new MicroserviceResponseFormatter<IUser | null>().buildFromException(
					error,
					{ token },
				),
			)
		})
	})

	describe('me', () => {
		it('should get user by token', async () => {
			const token = 'someToken'
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@email.test',
			}

			jest.spyOn(mockedUseCase, 'handler').mockResolvedValue(user)

			const result = await controller.me(token)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(token)
			expect(result).toEqual(
				new MicroserviceResponseFormatter<IUser | null>(
					true,
					HttpStatus.OK,
					undefined,
					user,
				),
			)
		})

		it('should handle errors during user retrieval', async () => {
			const token = 'someToken'
			const error = new Error('User retrieval error')

			jest.spyOn(mockedUseCase, 'handler').mockRejectedValue(error)

			const result = await controller.me(token)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(token)

			expect(result).toEqual(
				new MicroserviceResponseFormatter<IUser | null>().buildFromException(
					error,
					{ token },
				),
			)
		})
	})

	describe('getProfile', () => {
		it('should get user by id', async () => {
			const dto: GetProfileDTO = {
				userId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				token: 'someToken',
			}
			const user: IExternalProfile = {
				firstName: 'first',
				lastName: 'last',
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			}

			jest.spyOn(mockedUseCase, 'handler').mockResolvedValueOnce(user)

			const result = await controller.getProfile(dto)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(dto.userId)
			expect(result).toMatchObject(
				new MicroserviceResponseFormatter<IExternalProfile | null>(
					true,
					HttpStatus.OK,
					undefined,
					user,
				),
			)
		})

		it('should handle errors during user retrieval', async () => {
			const dto: GetProfileDTO = {
				userId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				token: 'someToken',
			}
			const error = new Error('User retrieval error')

			jest.spyOn(mockedUseCase, 'handler').mockRejectedValue(error)

			const result = await controller.getProfile(dto)

			expect(mockedUseCase.handler).toHaveBeenCalledWith(dto.userId)

			expect(result).toEqual(
				new MicroserviceResponseFormatter<IUser | null>().buildFromException(
					error,
					dto,
				),
			)
		})
	})
})
