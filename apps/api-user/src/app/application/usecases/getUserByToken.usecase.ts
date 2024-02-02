import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'

export default class GetUserByTokenUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository
	) {}

	async handler(token: string): Promise<UserModel> {
		const user = await this.userRepository.getUserByToken(token)
		if (!user) {
			throw new NotFoundException(
				"We don't have any account linked to this email"
			)
		}

		return user
	}
}
