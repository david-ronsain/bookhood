import { Inject, NotFoundException } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class GetUserByIdUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(userId: string): Promise<UserModel> {
		const user = await this.userRepository.getUserById(userId)
		if (!user) {
			throw new NotFoundException(
				this.i18n.t('errors.getUserById.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		return user
	}
}
