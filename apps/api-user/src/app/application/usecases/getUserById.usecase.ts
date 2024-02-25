import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'

export default class GetUserByIdUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
	) {}

	async handler(userId: string): Promise<UserModel> {
		const user = await this.userRepository.getUserById(userId)
		if (!user) {
			throw new NotFoundException('This user does not exist')
		}

		return user
	}
}
