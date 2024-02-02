import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { Document, Model, Query } from 'mongoose'
import { UserEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/user.entity'
import UserRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/user.repository.mongo'
import UserModel from '../../../../../src/app/domain/models/user.model'
import UserMapper from '../../../../../src/app/application/mappers/user.mapper'

const mockUserModel = () => ({
	countDocuments: jest.fn(),
	create: jest.fn(),
	findOne: jest.fn(),
	findOneAndUpdate: jest.fn(),
})

describe('UserRepositoryMongo', () => {
	let userRepository: UserRepositoryMongo
	let userModel: Model<UserEntity>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserRepositoryMongo,
				{
					provide: getModelToken('User'),
					useFactory: mockUserModel,
				},
			],
		}).compile()

		userRepository = module.get<UserRepositoryMongo>(UserRepositoryMongo)
		userModel = module.get<Model<UserEntity>>(getModelToken('User'))
	})

	describe('emailExists', () => {
		it('should return true if email exists', async () => {
			const email = 'first.last@name.test'
			jest.spyOn(userModel, 'countDocuments').mockResolvedValueOnce(1)

			const result = await userRepository.emailExists(email)

			expect(result).toBe(true)
			expect(userModel.countDocuments).toHaveBeenCalledWith({ email })
		})

		it('should return false if email does not exist', async () => {
			const email = 'first.last@name.test'
			jest.spyOn(userModel, 'countDocuments').mockResolvedValueOnce(0)

			const result = await userRepository.emailExists(email)

			expect(result).toBe(false)
			expect(userModel.countDocuments).toHaveBeenCalledWith({ email })
		})
	})

	describe('createUser', () => {
		it('should create a user', async () => {
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}
			const createdUserEntity: UserEntity = {
				...user,
				_id: '123',
			} as unknown as UserEntity
			jest.spyOn(userModel, 'create').mockResolvedValueOnce(
				createdUserEntity as unknown as (Document<
					unknown,
					object,
					UserEntity
				> &
					UserEntity &
					Required<{ _id: string }>)[]
			)

			const result = await userRepository.createUser(user)

			expect(result).toEqual(
				UserMapper.fromEntitytoModel(createdUserEntity)
			)
			expect(userModel.create).toHaveBeenCalledWith(user)
		})
	})

	describe('getUserByEmail', () => {
		it('should get a user by email', async () => {
			const email = 'first.last@name.test'
			const userEntity: UserEntity = {
				firstName: 'first',
				lastName: 'last',
				email,
				_id: '123',
			} as unknown as UserEntity
			jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(userEntity)

			const result = await userRepository.getUserByEmail(email)

			expect(result).toEqual(UserMapper.fromEntitytoModel(userEntity))
			expect(userModel.findOne).toHaveBeenCalledWith({ email })
		})

		it('should return null if user is not found by email', async () => {
			const email = 'first.last@name.test'
			jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null)

			const result = await userRepository.getUserByEmail(email)

			expect(result).toBeNull()
			expect(userModel.findOne).toHaveBeenCalledWith({ email })
		})
	})

	describe('getUserByToken', () => {
		it('should get a user by token', async () => {
			const token = 'someToken'
			const userEntity: UserEntity = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
				_id: '123',
			} as unknown as UserEntity
			jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(userEntity)

			const result = await userRepository.getUserByToken(token)

			expect(result).toEqual(UserMapper.fromEntitytoModel(userEntity))
			expect(userModel.findOne).toHaveBeenCalledWith({ token })
		})

		it('should return null if user is not found by token', async () => {
			const token = 'invalidToken'
			jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null)

			const result = await userRepository.getUserByToken(token)

			expect(result).toBeNull()
			expect(userModel.findOne).toHaveBeenCalledWith({ token })
		})
	})

	describe('update', () => {
		it('should update a user', async () => {
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}
			jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValueOnce({
				...user,
				_id: '123',
			})

			const result = await userRepository.update(user)

			expect(result).toEqual(
				UserMapper.fromEntitytoModel({
					...user,
					_id: '123',
				} as unknown as UserEntity)
			)
			expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ email: user.email },
				user
			)
		})

		it('should return null if user is not found for update', async () => {
			const user: UserModel = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}
			jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValueOnce(
				null
			)

			const result = await userRepository.update(user)

			expect(result).toBeNull()
			expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
				{ email: user.email },
				user
			)
		})
	})
})
