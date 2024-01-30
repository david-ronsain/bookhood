import { Inject, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user.repository'

export default class UserEmailExistsUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository
	) {}

	async handler(email: string): Promise<boolean> {
		const exists = await this.userRepository.emailExists(email)
		if (!exists) {
			throw new NotFoundException('An account exists with this email')
		}

		return exists
	}
}
