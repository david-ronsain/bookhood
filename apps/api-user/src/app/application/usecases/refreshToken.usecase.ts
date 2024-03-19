import { Inject, NotFoundException } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user.repository'
import envConfig from '../../../config/env.config'
import { Role } from '@bookhood/shared'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class RefreshTokenUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(token: string): Promise<Role[]> {
		const user = await this.userRepository.getUserByToken(token)
		if (!user) {
			throw new NotFoundException(
				this.i18n.t('errors.refresh.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		user.tokenExpiration = new Date(
			Date.now() + envConfig().settings.sessionDuration,
		)

		this.userRepository.update(user)

		return user.role
	}
}
