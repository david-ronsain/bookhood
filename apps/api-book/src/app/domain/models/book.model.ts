import { IBook, IBookImageLinks, IISBN } from '@bookhood/shared'

export default class BookModel {
	constructor(book?: IBook) {
		if (book) {
			this._id = book._id?.toString()
			this.authors = book.authors
			this.title = book.title
			this.categories = book.categories ?? []
			this.description = book.description
			this.image = book.image
			this.isbn = book.isbn
			this.language = book.language
			this.subtitle = book.subtitle
			this.publisher = book.publisher
			this.publishedDate = book.publishedDate
		}
	}

	readonly _id?: string

	readonly title: string

	readonly authors: string[]

	readonly categories?: string[]

	readonly description: string

	readonly image?: IBookImageLinks

	readonly isbn: IISBN[]

	readonly language: string

	readonly subtitle?: string

	readonly publisher?: string

	readonly publishedDate?: string
}
