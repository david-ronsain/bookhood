import UserModel from '../../../domain/models/user.model'
import { UserRepository } from '../../../domain/ports/user.repository'
import { InjectModel } from '@nestjs/mongoose'
import { UserEntity } from './entities/user.entity'
import { Injectable } from '@nestjs/common'
import UserMapper from '../../../application/mappers/user.mapper'
import { Model } from 'mongoose'

@Injectable()
export default class UserRepositoryMongo implements UserRepository {
	constructor(
		@InjectModel('User') private readonly userModel: Model<UserEntity>
	) {}

	async emailExists(email: string): Promise<boolean> {
		const filters = {
			email,
		}
		return this.userModel
			.countDocuments(filters)
			.then((count: number) => count > 0)
	}

	async createUser(user: UserModel): Promise<UserModel> {
		const createdUser = await this.userModel.create(user)

		return UserMapper.fromEntitytoModel(createdUser)
	}
}
