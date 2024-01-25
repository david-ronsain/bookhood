/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { UserEntity } from '../../../../../src//app/infrastructure/adapters/repository/entities/user.entity'
import UserRepositoryMongo from '../../../../../src//app/infrastructure/adapters/repository/user.repository.mongo'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { Document, Model, ObjectId, Query } from 'mongoose'
import UserModel from '../../../../../src/app/domain/models/user.model'
import { getModelToken } from '@nestjs/mongoose'
import { Role } from '../../../../../../shared/src'
import UserMapper from '../../../../../src/app/application/mappers/user.mapper'

const moduleMocker = new ModuleMocker(global)
describe('Testing UserRepositoryMongo', () => {
	let model: Model<UserEntity>
	let repo: UserRepositoryMongo

	const mock = {
		countDocuments: jest.fn(),
		create: jest.fn(),
	} as unknown as Model<UserEntity>

	beforeEach(async () => {
		jest.resetAllMocks()
		const module = await Test.createTestingModule({
			providers: [
				UserModel,
				UserRepositoryMongo,
				{
					provide: getModelToken('User'),
					useValue: mock,
				},
			],
		})
			.useMocker((token) => {
				if (typeof token === 'function') {
					const mockMetadata = moduleMocker.getMetadata(
						token
					) as MockFunctionMetadata<any, any>
					const Mock = moduleMocker.generateFromMetadata(mockMetadata)
					return new Mock()
				}
			})
			.compile()
		model = module.get<Model<UserEntity>>(getModelToken('User'))
		repo = module.get<UserRepositoryMongo>(UserRepositoryMongo)
	})

	describe('EmailExists method', () => {
		it('shoud return true for an existing email', () => {
			jest.spyOn(model, 'countDocuments').mockImplementationOnce(
				() =>
					Promise.resolve(1) as unknown as Query<
						number,
						Document<unknown, object, UserEntity> &
							UserEntity & { _id: ObjectId }
					>
			)
			expect(repo.emailExists('existing@email.test')).resolves.toBe(true)
		})

		it('shoud return false for a new email', () => {
			jest.spyOn(model, 'countDocuments').mockImplementationOnce(
				() =>
					Promise.resolve(0) as unknown as Query<
						number,
						Document<unknown, object, UserEntity> &
							UserEntity & { _id: ObjectId }
					>
			)
			expect(repo.emailExists('existing@email.test')).resolves.toBe(false)
		})
	})

	describe('CreateUser method', () => {
		it('should create the user', async () => {
			const userEntity = {
				firstName: 'first',
				lastName: 'last',
				email: 'new@email.test',
				role: [Role.USER],
			} as UserEntity
			const user = new UserModel(userEntity)
			const expectedResult = UserMapper.fromEntitytoModel(userEntity)

			jest.spyOn(model, 'create').mockImplementationOnce(
				() =>
					Promise.resolve(userEntity) as unknown as Promise<
						(Document<unknown, object, UserEntity> &
							UserEntity & { _id: ObjectId })[]
					>
			)
			expect(repo.createUser(user)).resolves.toMatchObject(expectedResult)
		})
	})
})
