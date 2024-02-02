import { ConflictException, Inject } from '@nestjs/common'
import { BookRepository } from '../../domain/ports/book.repository'
import { IBook, IISBN, ILibrary } from '@bookhood/shared'
import BookModel from '../../domain/models/book.model'
import { LibraryRepository } from '../../domain/ports/library.repository'
import LibraryModel from '../../domain/models/library.model'
import LibraryMapper from '../mappers/library.mapper'

export default class AddBookUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository
	) {}

	async handler(bookId: string, userId: string): Promise<ILibrary> {
		const exists = await this.libraryRepository.getByUserIdAndBookId(
			userId,
			bookId
		)

		if (exists) {
			throw new ConflictException('The book is already in your library')
		}

		const lib = await this.libraryRepository.create(
			new LibraryModel({ bookId, userId, location: undefined })
		)

		return LibraryMapper.modelObjectIdToString(lib)
	}
}
