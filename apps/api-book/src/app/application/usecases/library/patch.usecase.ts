import {
	ConflictException,
	ForbiddenException,
	Inject,
	NotFoundException,
} from '@nestjs/common'
import { ILibrary, LibraryStatus } from '@bookhood/shared'
import { LibraryRepository } from '../../../domain/ports/library.repository'

export default class PatchUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
	) {}

	async handler(
		userId: string,
		libraryId: string,
		status: LibraryStatus,
	): Promise<ILibrary> {
		const lib = await this.libraryRepository.getById(libraryId)

		if (!lib) {
			throw new NotFoundException('This book does not exist')
		}

		if (lib.userId.toString() !== userId) {
			throw new ForbiddenException('You can not update this book')
		}

		return await this.libraryRepository.update(libraryId, status)
	}
}
