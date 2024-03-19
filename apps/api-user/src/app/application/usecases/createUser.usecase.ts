import { ICreateUserDTO, Locale } from '@bookhood/shared'
import { ConflictException, Inject } from '@nestjs/common'
import UserModel from '../../domain/models/user.model'
import { UserRepository } from '../../domain/ports/user.repository'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class CreateUserUseCase {
	constructor(
		@Inject('UserRepository')
		private readonly userRepository: UserRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(user: ICreateUserDTO): Promise<UserModel> {
		const exists = await this.userRepository.emailExists(user.email)
		if (exists) {
			throw new ConflictException(
				this.i18n.t('errors.createUser.conflict', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		return this.userRepository.createUser(
			new UserModel({
				...user,
				locale: user?.session?.locale ?? Locale.FR,
			}),
		)
	}
}
