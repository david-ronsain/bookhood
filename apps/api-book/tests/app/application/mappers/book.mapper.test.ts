import BookMapper from '../../../../src/app/application/mappers/book.mapper'
import { BookEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/book.entity'

describe('BookMapper', () => {
	it('should map BookEntity to BookModel', () => {
		const bookEntity = {
			authors: ['author'],
			description: 'desc',
			isbn: [
				{
					type: 'ISBN_13',
					identifier: '01234567890123',
				},
			],
			language: 'fr',
			title: 'title',
			categories: ['category'],
			image: { smallThumbnail: '', thumbnail: '' },
			publishedDate: '2024',
			publisher: 'publisher',
			subtitle: 'subtitle',
		} as unknown as BookEntity

		const bookModel = BookMapper.fromEntitytoModel(bookEntity)

		Object.keys(bookModel).forEach((prop: string) => {
			expect(bookModel[prop]).toBe(bookEntity[prop])
		})
	})
})
