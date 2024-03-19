import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import RequestModel from '../../../domain/models/request.model'
import { IRequest, RequestStatus } from '@bookhood/shared'
import RequestMapper from '../../mappers/request.mapper'
import { I18nService } from 'nestjs-i18n'

export default class CreateRequestUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
		@Inject('LibraryRepository')
		private readonly libraryRepository: LibraryRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(
		userId: string,
		libraryId: string,
		dates: string[],
	): Promise<IRequest> {
		const library = await this.libraryRepository.getById(libraryId)
		if (!library) {
			throw new NotFoundException(
				this.i18n.t('errors.request.createRequest.notFound'),
			)
		}

		const currentlyBorrowed =
			await this.requestRepository.countActiveRequestsForUser(
				userId,
				dates,
			)
		if (currentlyBorrowed > 0) {
			throw new ForbiddenException(
				this.i18n.t('errors.request.createRequest.forbidden'),
			)
		}

		const request = new RequestModel({
			libraryId,
			ownerId: library.userId.toString(),
			userId,
			status: RequestStatus.PENDING_VALIDATION,
			startDate: dates[0].toString(),
			endDate: dates[1].toString(),
			events: [
				{
					currentStatus: RequestStatus.PENDING_VALIDATION,
					currentStartDate: dates[0],
					currentEndDate: dates[1],
					date: new Date().toString(),
					userId,
				},
			],
		})
		const createdRequest = await this.requestRepository.create(request)

		return RequestMapper.modelObjectIdToString(createdRequest)
	}
}
