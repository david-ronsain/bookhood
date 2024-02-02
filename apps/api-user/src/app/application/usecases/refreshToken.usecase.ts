import { Inject, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user.repository'
import envConfig from '../../../config/env.config'
import { Role } from '@bookhood/shared'

export default class RefreshTokenUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository
	) {}

	async handler(token: string): Promise<Role[]> {
		const user = await this.userRepository.getUserByToken(token)
		if (!user) {
			throw new NotFoundException(
				"We don't have an account linked to this email"
			)
		}

		user.tokenExpiration = new Date(
			Date.now() + envConfig().settings.sessionDuration
		)

		this.userRepository.update(user)

		return user.role
	}
}
