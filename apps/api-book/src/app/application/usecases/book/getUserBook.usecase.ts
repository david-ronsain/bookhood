import { Inject, NotFoundException } from '@nestjs/common'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { ILibraryFull } from '@bookhood/shared'
import { I18nService } from 'nestjs-i18n'

export default class GetUserBookUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(libraryId: string): Promise<ILibraryFull> {
		const book = await this.libraryRepository.getFullById(libraryId)
		if (!book) {
			throw new NotFoundException(
				this.i18n.t('errors.book.getUserBook.notFound'),
			)
		}

		return book
	}
}
