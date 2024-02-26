import { Inject, NotFoundException } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import { IRequestInfos } from '@bookhood/shared'

export default class GetByIdUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
	) {}

	async handler(requestId: string): Promise<IRequestInfos | null> {
		const request = await this.requestRepository.getRequestInfos(requestId)
		if (!request) {
			throw new NotFoundException('Request not found')
		}

		return request
	}
}
