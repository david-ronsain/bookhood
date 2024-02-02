import type { type IBook } from '@bookhood/shared'
import type { IGoogleBook } from '../interfaces/book.interface'

export const mapBooks = (books: IGoogleBook[]): IBook[] =>
	books.map((book) => mapBook(book))

export const mapBook = (book: IGoogleBook): IBook => ({
	value: (book.volumeInfo?.industryIdentifiers || []).find(
		(isbn) => isbn.type === 'ISBN_13'
	)
		? (book.volumeInfo?.industryIdentifiers || []).find(
				(isbn) => isbn.type === 'ISBN_13'
		  ).identifier
		: (book.volumeInfo?.industryIdentifiers || []).find(
				(isbn) => isbn.type === 'ISBN_10'
		  ).identifier,
	title: book.volumeInfo.title,
	authors: book.volumeInfo.authors ?? [],
	categories: book.volumeInfo.categories ?? [],
	description: book.volumeInfo.description,
	image: book.volumeInfo.imageLinks,
	isbn: book.volumeInfo?.industryIdentifiers || [],
	language: book.volumeInfo.language,
	subtitle: book.volumeInfo.subtitle,
	publisher: book.volumeInfo.publisher,
	publishedDate: book.volumeInfo.publishedDate,
})
