import { Inject } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user.repository'

export default class UserEmailExistsUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
	) {}

	async handler(email: string): Promise<boolean> {
		return await this.userRepository.emailExists(email)
	}
}
