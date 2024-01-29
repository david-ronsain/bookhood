import { ISendLinkDTO } from '@bookhood/shared'
import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'
import { v4 } from 'uuid'
import envConfig from '../../../config/env.config'

export default class CreateAuthLinkUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository
	) {}

	async handler(dto: ISendLinkDTO): Promise<UserModel> {
		const user = await this.userRepository.getUserByEmail(dto.email)
		if (!user) {
			throw new NotFoundException(
				"We don't have an account linked to this email"
			)
		}

		if (!user.token || user.tokenExpiration < new Date()) {
			user.token = Buffer.from(user.email).toString('base64') + '|' + v4()
			user.tokenExpiration = new Date(
				Date.now() + envConfig().settings.sessionDuration
			)

			this.userRepository.update(user)
		}

		return user
	}
}
