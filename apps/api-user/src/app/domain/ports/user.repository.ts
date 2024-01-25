import UserModel from '../models/user.model'

export interface UserRepository {
	createUser(user: UserModel): Promise<UserModel>

	emailExists(email: string, id?: string): Promise<boolean>
}
