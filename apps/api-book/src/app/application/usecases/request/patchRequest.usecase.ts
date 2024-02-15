import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import { IRequest, IRequestEvent, RequestStatus } from '@bookhood/shared'
import RequestMapper from '../../mappers/request.mapper'
import { ClientProxy } from '@nestjs/microservices'

export default class PatchRequestUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
		@Inject('RabbitMail') private readonly mailClient: ClientProxy,
	) {}

	async handler(
		userId: string,
		requestId: string,
		status: RequestStatus,
	): Promise<IRequest> {
		const request = await this.requestRepository.getById(requestId)
		if (!request) {
			throw new NotFoundException('Request not found')
		}

		const currentlyBorrowed =
			await this.requestRepository.countActiveRequestsForUser(
				request.userId.toString(),
			)
		if (
			currentlyBorrowed > 0 &&
			status === RequestStatus.ACCEPTED_PENDING_DELIVERY
		) {
			throw new ForbiddenException(
				'This user has already a loan in progress, you can not load him your book',
			)
		}

		if (!this.statusAllowed(request.status, status)) {
			throw new ForbiddenException(
				`The request can not go from "${request.status}" to "${status}`,
			)
		}

		const event: IRequestEvent = {
			oldStatus: request.status,
			currentStatus: status,
			date: new Date().toString(),
			userId,
		}
		const updated = await this.requestRepository.patch(requestId, status, [
			event,
			...request.events,
		])

		const infos = await this.requestRepository.getRequestInfos(requestId)

		if (status === RequestStatus.REFUSED) {
			this.mailClient.send('mail-request-refused', infos).subscribe()
		} else if (status === RequestStatus.ACCEPTED_PENDING_DELIVERY) {
			this.mailClient.send('mail-request-accepted', infos).subscribe()
		}

		return RequestMapper.modelObjectIdToString(updated)
	}

	statusAllowed = (
		currentStatus: RequestStatus | undefined,
		desiredStatus: RequestStatus,
	): boolean => {
		const statusesAllowed = {
			[RequestStatus.NONE]: [RequestStatus.PENDING_VALIDATION],
			[RequestStatus.PENDING_VALIDATION]: [
				RequestStatus.ACCEPTED_PENDING_DELIVERY,
				RequestStatus.REFUSED,
			],
			[RequestStatus.ACCEPTED_PENDING_DELIVERY]: [RequestStatus.RECEIVED],
			[RequestStatus.RECEIVED]: [RequestStatus.RETURN_PENDING],
			[RequestStatus.RETURN_PENDING]: [
				RequestStatus.RETURN_ACCEPTED,
				RequestStatus.RETURNED_WITH_ISSUE,
			],
		}

		return statusesAllowed[currentStatus].includes(desiredStatus)
	}
}
