import { Inject } from '@nestjs/common'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { UserLibraryStats } from '@bookhood/shared-api'

export default class GetUserLibraryStatsUseCase {
	constructor(
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
	) {}

	async handler(userId: string): Promise<UserLibraryStats | null> {
		return await this.libraryRepository.getStats(userId)
	}
}
