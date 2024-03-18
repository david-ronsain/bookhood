/* eslint-disable @nx/enforce-module-boundaries */
import { bookEntity } from '../../../../../shared-api/test/'
import BookMapper from '../../../../src/app/application/mappers/book.mapper'
import { BookEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/book.entity'

describe('BookMapper', () => {
	it('should map BookEntity to BookModel', () => {
		const bookModel = BookMapper.fromEntitytoModel(
			bookEntity as unknown as BookEntity,
		)

		Object.keys(bookModel).forEach((prop: string) => {
			expect(bookModel[prop]).toBe(bookEntity[prop])
		})
	})
})
