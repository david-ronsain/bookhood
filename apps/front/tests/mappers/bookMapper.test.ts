import { describe } from 'vitest'
import { mapBooks, mapBook } from '../../src/mappers/bookMapper'
import { IGoogleBook } from '../../src/interfaces/book.interface'
import { IBook } from '../../../shared/src'

const googleBooks: IGoogleBook[] = [
	{
		volumeInfo: {
			industryIdentifiers: [{ type: 'ISBN_13', identifier: '0000' }],
			title: 'title',
			authors: ['author'],
			categories: ['categories'],
			description: 'desc',
			imageLinks: {
				smallThumbnail: 'small',
				thumbnail: 'normal',
			},
			language: 'fr',
			subtitle: 'subtitle',
			publisher: 'publisher',
			publishedDate: '2022',
		},
	},
]

describe('Testing the book mapper', () => {
	describe('Testing the mapBooks method', () => {
		it('should return the mapped object', () => {
			googleBooks.forEach((book: IGoogleBook) => {
				compareBook(mapBook(book), book)
			})
		})
	})

	describe('Testing the mapBook method', () => {
		it('should return the mapped object', () => {
			compareBook(mapBook(googleBooks[0]), googleBooks[0])
		})
	})

	const compareBook = (mapped: IBook, googleBook: IGoogleBook) => {
		expect(mapped.title).toMatchObject(googleBook.volumeInfo.title)
		expect(mapped.authors).toMatchObject(googleBook.volumeInfo.authors)
		expect(mapped.categories).toMatchObject(
			googleBook.volumeInfo.categories,
		)
		expect(mapped.description).toMatchObject(
			googleBook.volumeInfo.description,
		)
		expect(mapped.image).toMatchObject(googleBook.volumeInfo.imageLinks)
		expect(mapped.isbn).toMatchObject(
			googleBook.volumeInfo.industryIdentifiers as any[],
		)
		expect(mapped.language).toMatchObject(googleBook.volumeInfo.language)
		expect(mapped.subtitle).toMatchObject(googleBook.volumeInfo.subtitle)
		expect(mapped.publisher).toMatchObject(googleBook.volumeInfo.publisher)
		expect(mapped.publishedDate).toMatchObject(
			googleBook.volumeInfo.publishedDate,
		)
	}
})
