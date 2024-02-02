import { Inject } from '@nestjs/common'
import { IBookSearch } from '@bookhood/shared'
import BookRepositoryMongo from '../../infrastructure/adapters/repository/book.repository.mongo'

export default class SearchBookUseCase {
	constructor(
		@Inject('BookRepository')
		private readonly bookRepository: BookRepositoryMongo
	) {}

	async handler(
		search: string,
		startAt: number,
		language: string,
		boundingBox: number[]
	): Promise<IBookSearch> {
		const [category, term] = search.split(':')
		return await this.bookRepository.search(
			category,
			term,
			startAt,
			language,
			boundingBox
		)
	}
}
