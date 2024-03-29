import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import {
	IRequest,
	IRequestEvent,
	IRequestInfos,
	RequestStatus,
	Session,
	SessionInfos,
} from '@bookhood/shared'
import RequestMapper from '../../mappers/request.mapper'
import { ClientProxy } from '@nestjs/microservices'
import { format } from 'date-fns'
import {
	MQMailMessageType,
	PatchRequestMQDTO,
	RequestInfosDTO,
} from '@bookhood/shared-api'
import { I18nContext, I18nService } from 'nestjs-i18n'

export default class PatchRequestUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
		@Inject('RabbitMail') private readonly mailClient: ClientProxy,
		private readonly i18n: I18nService,
	) {}

	async handler(body: PatchRequestMQDTO): Promise<IRequest> {
		const request = await this.requestRepository.getById(body.requestId)
		if (!request) {
			throw new NotFoundException(
				this.i18n.t('errors.request.patchRequest.notFound', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		const currentlyBorrowed =
			await this.requestRepository.countActiveRequestsForUser(
				request.userId.toString(),
				body.dates ?? [
					format(new Date(), 'yyyy-MM-dd'),
					format(new Date(), 'yyyy-MM-dd'),
				],
				request._id,
			)
		if (
			currentlyBorrowed > 0 &&
			body.status === RequestStatus.ACCEPTED_PENDING_DELIVERY
		) {
			throw new ForbiddenException(
				this.i18n.t('errors.request.patchRequest.forbidden1', {
					lang: I18nContext.current()?.lang,
				}),
			)
		}

		if (
			request.status !== body.status &&
			!this.statusAllowed(request.status, body.status)
		) {
			throw new ForbiddenException(
				this.i18n.t('errors.request.patchRequest.forbidden2', {
					lang: I18nContext.current()?.lang,
					args: {
						from: request.status,
						to: body.status,
					},
				}),
			)
		}

		const event: IRequestEvent = {
			oldStatus: request.status,
			currentStatus: body.status,
			oldStartDate: request.startDate
				? format(request.startDate, 'yyyy-MM-dd')
				: undefined,
			currentStartDate: body.dates[0] ?? request.startDate,
			oldEndDate: request.endDate
				? format(request.endDate, 'yyyy-MM-dd')
				: undefined,
			currentEndDate: body.dates[1] ?? request.endDate,
			date: new Date().toString(),
			userId: body.user._id,
		}
		const updated = await this.requestRepository.patch(
			body.requestId,
			body.status,
			[event, ...(request.events ?? [])],
			body.dates ? body.dates[0] : undefined,
			body.dates ? body.dates[1] : undefined,
		)

		const infos = await this.requestRepository.getRequestInfos(
			body.requestId,
		)

		if (request.status !== body.status) {
			if (body.status === RequestStatus.REFUSED) {
				this.sendMail(
					MQMailMessageType.REQUEST_REFUSED,
					infos,
					body.session,
				)
			} else if (
				body.status === RequestStatus.ACCEPTED_PENDING_DELIVERY
			) {
				this.sendMail(
					MQMailMessageType.REQUEST_ACCEPTED,
					infos,
					body.session,
				)
			} else if (body.status === RequestStatus.NEVER_RECEIVED) {
				this.sendMail(
					MQMailMessageType.REQUEST_NEVER_RECEIVED,
					infos,
					body.session,
				)
			} else if (body.status === RequestStatus.RETURNED_WITH_ISSUE) {
				this.sendMail(
					MQMailMessageType.REQUEST_RETURNED_WITH_ISSUE,
					infos,
					body.session,
				)
			}
		}

		return RequestMapper.modelObjectIdToString(updated)
	}

	sendMail = (
		messageType: MQMailMessageType,
		infos: IRequestInfos,
		session: SessionInfos,
	): void => {
		this.mailClient
			.send(messageType, {
				...infos,
				session,
			} as RequestInfosDTO)
			.subscribe()
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
			[RequestStatus.ACCEPTED_PENDING_DELIVERY]: [
				RequestStatus.RECEIVED,
				RequestStatus.NEVER_RECEIVED,
			],
			[RequestStatus.NEVER_RECEIVED]: [RequestStatus.RECEIVED],
			[RequestStatus.RECEIVED]: [RequestStatus.RETURN_PENDING],
			[RequestStatus.RETURN_PENDING]: [
				RequestStatus.RETURN_ACCEPTED,
				RequestStatus.RETURNED_WITH_ISSUE,
			],
			[RequestStatus.RETURNED_WITH_ISSUE]: [RequestStatus.ISSUE_FIXED],
		}

		return statusesAllowed[currentStatus].includes(desiredStatus)
	}
}
