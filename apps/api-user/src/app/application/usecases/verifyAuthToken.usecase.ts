import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common'
import { UserRepository } from '../../domain/ports/user.repository'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class VerifyAuthTokenUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(email: string, token: string): Promise<boolean> {
		const user = await this.userRepository.getUserByEmail(email)
		if (!user) {
			throw new NotFoundException(
				this.i18n.t('errors.verifyAuthToken.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		const userToken = user.token.split('|')[1] ?? null
		if (!userToken || userToken !== token) {
			user.token = null
			user.tokenExpiration = null
			await this.userRepository.update(user)
			throw new ForbiddenException(
				this.i18n.t('errors.verifyAuthToken.forbidden1', {
					lang: I18nContext.current()?.lang,
				}),
			)
		} else if (user.tokenExpiration < new Date()) {
			user.token = null
			user.tokenExpiration = null
			await this.userRepository.update(user)
			throw new ForbiddenException(
				this.i18n.t('errors.verifyAuthToken.forbidden2', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		return true
	}
}
