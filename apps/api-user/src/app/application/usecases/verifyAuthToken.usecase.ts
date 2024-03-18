import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user.repository'

export default class VerifyAuthTokenUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
	) {}

	async handler(email: string, token: string): Promise<boolean> {
		const user = await this.userRepository.getUserByEmail(email)
		if (!user) {
			throw new NotFoundException(
				"We don't have an account linked to this email",
			)
		}

		const userToken = user.token.split('|')[1] ?? null
		if (!userToken || userToken !== token) {
			user.token = null
			user.tokenExpiration = null
			await this.userRepository.update(user)
			throw new ForbiddenException(
				'Your signin link is incorrect, please signin again',
			)
		} else if (user.tokenExpiration < new Date()) {
			user.token = null
			user.tokenExpiration = null
			await this.userRepository.update(user)
			throw new ForbiddenException(
				'Your session has expired, please signin again',
			)
		}

		return true
	}
}
