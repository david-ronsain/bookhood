import { ConflictException, Inject } from '@nestjs/common'
import { ICoords, ILibrary, LibraryStatus } from '@bookhood/shared'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import LibraryModel from '../../../domain/models/library.model'
import LibraryMapper from '../../mappers/library.mapper'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class AddBookUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(
		bookId: string,
		userId: string,
		location: ICoords,
		status: LibraryStatus,
		place: string,
	): Promise<ILibrary> {
		const exists = await this.libraryRepository.getByUserIdAndBookId(
			userId,
			bookId,
		)

		if (exists) {
			throw new ConflictException(
				this.i18n.t('errors.book.addBook.conflict', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		const lib = await this.libraryRepository.create(
			new LibraryModel({
				bookId,
				userId,
				location: {
					type: 'Point',
					coordinates: [location.lng, location.lat],
				},
				place,
				status,
			}),
		)

		return LibraryMapper.modelObjectIdToString(lib)
	}
}
