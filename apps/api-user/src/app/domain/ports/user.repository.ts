import UserModel from '../models/user.model'

export interface UserRepository {
	createUser(user: UserModel): Promise<UserModel>

	emailExists(email: string, id?: string): Promise<boolean>

	getUserByEmail(email: string): Promise<UserModel | null>

	getUserById(id: string): Promise<UserModel>

	getUserByToken(token: string): Promise<UserModel | null>

	update(user: UserModel): Promise<UserModel>
}
