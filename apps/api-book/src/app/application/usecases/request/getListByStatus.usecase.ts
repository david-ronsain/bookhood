import { Inject } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import { IRequestList, RequestStatus } from '@bookhood/shared'

export default class GetListByStatusUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
	) {}

	async handler(
		userId: string,
		status: RequestStatus,
		startAt: number,
	): Promise<IRequestList> {
		return await this.requestRepository.getListByStatus(
			userId,
			status,
			startAt,
		)
	}
}
