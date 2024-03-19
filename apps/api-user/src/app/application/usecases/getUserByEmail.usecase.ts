import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class GetUserByEmailUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(email: string): Promise<UserModel> {
		const user = await this.userRepository.getUserByEmail(email)
		if (!user) {
			throw new NotFoundException(
				this.i18n.t('errors.getUserByEmail.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		return user
	}
}
