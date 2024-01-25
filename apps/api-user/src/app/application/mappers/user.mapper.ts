import UserModel from '../../domain/models/user.model'
import { UserEntity } from '../../infrastructure/adapters/repository/entities/user.entity'

export default class UserMapper {
	public static fromEntitytoModel(userEntity: UserEntity): UserModel {
		return new UserModel(userEntity)
	}
}
