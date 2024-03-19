import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class GetUserByTokenUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(token: string): Promise<UserModel> {
		const user = await this.userRepository.getUserByToken(token)
		if (!user) {
			throw new NotFoundException(
				this.i18n.t('errors.user.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		return user
	}
}
