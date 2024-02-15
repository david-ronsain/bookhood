import { Inject, NotFoundException } from '@nestjs/common'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { ILibraryFull } from '@bookhood/shared'

export default class GetUserBookUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
	) {}

	async handler(libraryId: string): Promise<ILibraryFull> {
		const book = await this.libraryRepository.getFullById(libraryId)
		if (!book) {
			throw new NotFoundException('This book does not exist')
		}

		return book
	}
}
