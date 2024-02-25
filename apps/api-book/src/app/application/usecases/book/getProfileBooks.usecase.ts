import { Inject } from '@nestjs/common'
import { IBooksList } from '@bookhood/shared'
import { LibraryRepository } from '../../../domain/ports/library.repository'

export default class GetProfileBooksUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
	) {}

	async handler(userId: string, page: number): Promise<IBooksList> {
		return await this.libraryRepository.getProfileBooks(userId, page)
	}
}
