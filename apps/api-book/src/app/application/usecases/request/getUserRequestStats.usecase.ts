import { Inject } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import { UserRequestStats } from '@bookhood/shared-api'

export default class GetUserRequestStatsUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
	) {}

	async handler(userId: string): Promise<UserRequestStats | null> {
		return await this.requestRepository.getStats(userId)
	}
}
