import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'

export default class GetUserByEmailUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository
	) {}

	async handler(email: string): Promise<UserModel> {
		const user = await this.userRepository.getUserByEmail(email)
		if (!user) {
			throw new NotFoundException(
				"We don't have any account linked to this email"
			)
		}

		return user
	}
}
