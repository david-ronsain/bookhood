import { IBookSearch } from '@bookhood/shared'
import BookModel from '../models/book.model'

export interface BookRepository {
	create(book: BookModel): Promise<BookModel>

	getByISBN(isbn: string[]): Promise<BookModel | null>

	search(
		category: string,
		term: string,
		startAt: number,
		language: string,
		boundingBox: number[],
		email?: string,
	): Promise<IBookSearch>
}
