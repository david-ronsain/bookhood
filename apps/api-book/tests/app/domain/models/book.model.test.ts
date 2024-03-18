/* eslint-disable @nx/enforce-module-boundaries */
import { book } from '../../../../../shared-api/test'
import BookModel from '../../../../src/app/domain/models/book.model'

describe('BookModel', () => {
	it('should create an instance of BookModel with provided data', () => {
		const bookData = book

		let bookModel = new BookModel(bookData)

		expect(bookModel._id).toEqual(bookData._id)
		expect(bookModel.title).toEqual(bookData.title)
		expect(bookModel.authors).toEqual(bookData.authors)
		expect(bookModel.categories).toEqual(bookData.categories)
		expect(bookModel.description).toEqual(bookData.description)
		expect(bookModel.image).toEqual(bookData.image)
		expect(bookModel.isbn).toEqual(bookData.isbn)
		expect(bookModel.language).toEqual(bookData.language)
		expect(bookModel.subtitle).toEqual(bookData.subtitle)
		expect(bookModel.publisher).toEqual(bookData.publisher)
		expect(bookModel.publishedDate).toEqual(bookData.publishedDate)

		bookData.categories = undefined
		bookModel = new BookModel(bookData)
		expect(bookModel.categories).toMatchObject([])
	})

	it('should create an instance of BookModel with default values if no data is provided', () => {
		const bookModel = new BookModel()

		expect(bookModel._id).toBeUndefined()
		expect(bookModel.title).toBeUndefined()
		expect(bookModel.authors).toEqual([])
		expect(bookModel.categories).toEqual([])
		expect(bookModel.description).toBeUndefined()
		expect(bookModel.image).toBeUndefined()
		expect(bookModel.isbn).toEqual([])
		expect(bookModel.language).toBeUndefined()
		expect(bookModel.subtitle).toBeUndefined()
		expect(bookModel.publisher).toBeUndefined()
		expect(bookModel.publishedDate).toBeUndefined()
	})
})
