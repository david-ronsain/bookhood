import BookModel from '../../domain/models/book.model'
import { BookEntity } from '../../infrastructure/adapters/repository/entities/book.entity'

export default class BookMapper {
	public static fromEntitytoModel(bookEntity: BookEntity): BookModel {
		return new BookModel(bookEntity)
	}
}
