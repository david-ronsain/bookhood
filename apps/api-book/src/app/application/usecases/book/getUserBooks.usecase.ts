import { Inject } from '@nestjs/common'
import { ILibraryFull } from '@bookhood/shared'
import { LibraryRepository } from '../../../domain/ports/library.repository'

export default class GetUserBooksUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
	) {}

	async handler(userId: string, page: number): Promise<ILibraryFull[]> {
		return await this.libraryRepository.getByUser(userId, page)
	}
}
