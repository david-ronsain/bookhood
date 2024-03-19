import {
	ConflictException,
	ForbiddenException,
	Inject,
	NotFoundException,
} from '@nestjs/common'
import { ILibrary, LibraryStatus } from '@bookhood/shared'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { I18nService } from 'nestjs-i18n'

export default class PatchUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(
		userId: string,
		libraryId: string,
		status: LibraryStatus,
	): Promise<ILibrary> {
		const lib = await this.libraryRepository.getById(libraryId)

		if (!lib) {
			throw new NotFoundException(
				this.i18n.t('errors.library.patch.notFound'),
			)
		}

		if (lib.userId.toString() !== userId) {
			throw new ForbiddenException(
				this.i18n.t('errors.library.patch.forbidden'),
			)
		}

		return await this.libraryRepository.update(libraryId, status)
	}
}
