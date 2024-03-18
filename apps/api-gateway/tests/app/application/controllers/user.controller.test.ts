/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from '../../../../src/app/application/controllers/user.controller'
import { of } from 'rxjs'
import {
	CurrentUser,
	MQUserMessageType,
	MicroserviceResponseFormatter,
} from '../../../../../shared-api/src/'
import {
	CreateUserDTO,
	UserStats,
} from '../../../../src/app/application/dto/user.dto'
import { HttpException, HttpStatus } from '@nestjs/common'
import { IExternalProfile, IUser, Role } from '../../../../../shared/src'
import { UserNotFoundException } from '../../../../src/app/application/exceptions'
import {
	currentUser,
	userLibraryStats,
	userLight,
	userRequestStats,
} from '../../../../../shared-api/test'

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
				{
					provide: 'RabbitBook',
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
		const userToCreate: CreateUserDTO = {
			email: 'first.last@name.test',
			firstName: 'first',
			lastName: 'last',
		}

		it('should create an user', async () => {
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
				MQUserMessageType.CREATE,
				userToCreate,
			)

			expect(result).toMatchObject(userToCreate)
		})

		it('should throw an error if the microservice returns an error', async () => {
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
				MQUserMessageType.CREATE,
				userToCreate,
			)
		})
	})

	describe('me', () => {
		it("should return the current user's data", async () => {
			const response = new MicroserviceResponseFormatter<IUser>(
				true,
				HttpStatus.OK,
				{},
				userLight,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.me(currentUser)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQUserMessageType.GET_ME,
				currentUser.token,
			)

			expect(result).toMatchObject(userLight)
		})

		it('should throw an error if no token is provided', async () => {
			await expect(
				controller.me({} as unknown as CurrentUser),
			).rejects.toThrow(UserNotFoundException)
		})

		it('should throw an error if the microservice returns an error', async () => {
			const response = new MicroserviceResponseFormatter<IUser>(
				false,
				HttpStatus.NOT_FOUND,
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(controller.me(currentUser)).rejects.toThrow(
				UserNotFoundException,
			)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQUserMessageType.GET_ME,
				currentUser.token,
			)
		})
	})

	describe('getProfile', () => {
		it('should return the user profile', async () => {
			const userId = 'someId'

			const response =
				new MicroserviceResponseFormatter<IExternalProfile>(
					true,
					HttpStatus.OK,
					{},
					{
						_id: userId,
						firstName: expect.any(String),
						lastName: expect.any(String),
					},
				)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getProfile(currentUser, userId)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQUserMessageType.GET_PROFILE,
				{ user: currentUser, userId },
			)

			expect(result).toMatchObject(response.data)
		})

		it('should throw an error if the microservice returns an error', async () => {
			const userId = 'someId'

			const response =
				new MicroserviceResponseFormatter<IExternalProfile>(
					false,
					HttpStatus.NOT_FOUND,
				)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			await expect(
				controller.getProfile(currentUser, userId),
			).rejects.toThrow(UserNotFoundException)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQUserMessageType.GET_PROFILE,
				{ user: currentUser, userId },
			)
		})
	})

	describe('getStats', () => {
		it("should return the user's stats", async () => {
			const response = new MicroserviceResponseFormatter<UserStats>(
				true,
				HttpStatus.OK,
				{},
				{
					...userLibraryStats,
					...userRequestStats,
				},
			)

			jest.spyOn(controller['userQueue'], 'send').mockReturnValueOnce(
				of(response),
			)

			const result = await controller.getStats(currentUser)

			expect(controller['userQueue'].send).toHaveBeenCalledWith(
				MQUserMessageType.GET_STATS,
				'userId',
			)

			expect(result).toMatchObject(response.data)
		})
	})
})
