import { ConflictException, Inject } from '@nestjs/common'
import { BookRepository } from '../../domain/ports/book.repository'
import { IAddBookDTO, IBook, IISBN } from '@bookhood/shared'
import BookModel from '../../domain/models/book.model'

export default class CreateBookIfNewUseCase {
	constructor(
		@Inject('BookRepository')
		private readonly bookRepository: BookRepository
	) {}

	async handler(dto: IAddBookDTO): Promise<IBook> {
		let book = await this.bookRepository.getByISBN(
			dto.isbn.map((isbn: IISBN) => isbn.identifier)
		)

		if (!book) {
			book = await this.bookRepository.create(new BookModel(dto))
		}
		return book
	}
}
