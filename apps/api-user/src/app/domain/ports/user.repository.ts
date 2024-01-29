import UserModel from '../models/user.model'

export interface UserRepository {
	createUser(user: UserModel): Promise<UserModel>

	emailExists(email: string, id?: string): Promise<boolean>

	getUserByEmail(email: string): Promise<UserModel>

	update(user: UserModel): Promise<UserModel>
}
