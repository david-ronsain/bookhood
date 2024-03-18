import { ICreateUserDTO } from '@bookhood/shared'
import { ConflictException, Inject } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'

export default class CreateUserUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
	) {}

	async handler(user: ICreateUserDTO): Promise<UserModel> {
		const exists = await this.userRepository.emailExists(user.email)
		if (exists) {
			throw new ConflictException('An account exists with this email')
		}

		return this.userRepository.createUser(new UserModel(user))
	}
}
