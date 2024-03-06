import { Controller, HttpStatus, Inject } from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import {
	IRequest,
	BookRequestMailDTO,
	IRequestList,
	IRequestInfos,
} from '@bookhood/shared'
import {
	CreateRequestMQDTO,
	GetRequestsMQDTO,
	MicroserviceResponseFormatter,
	PatchRequestMQDTO,
} from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import CreateRequestUseCase from '../usecases/request/createRequest.usecase'
import GetUserBookUseCase from '../usecases/book/getUserBook.usecase'
import GetListByStatusUseCase from '../usecases/request/getListByStatus.usecase'
import PatchRequestUseCase from '../usecases/request/patchRequest.usecase'
import GetByIdUseCase from '../usecases/request/getById.usecase'

@Controller()
export class RequestController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitMail') private readonly mailClient: ClientProxy,
		private readonly getUserBookUseCase: GetUserBookUseCase,
		private readonly createRequestUseCase: CreateRequestUseCase,
		private readonly getListByStatusUseCase: GetListByStatusUseCase,
		private readonly patchRequestUseCase: PatchRequestUseCase,
		private readonly getByIdUseCase: GetByIdUseCase,
	) {}

	@MessagePattern('request-create')
	async create(
		body: CreateRequestMQDTO,
	): Promise<MicroserviceResponseFormatter<IRequest>> {
		try {
			const library = await this.getUserBookUseCase.handler(
				body.libraryId,
			)

			const request = await this.createRequestUseCase.handler(
				body.user._id,
				body.libraryId,
			)

			this.mailClient
				.send('mail-request-created', {
					book: library.book.title,
					emitterFirstName: body.user.firstName,
					recipientFirstName: library.user.firstName,
					email: library.user.email,
					requestId: request._id.toString(),
				} as BookRequestMailDTO)
				.subscribe()

			return new MicroserviceResponseFormatter<IRequest>(
				true,
				HttpStatus.OK,
				body,
				request,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IRequest>().buildFromException(
				err,
				body,
			)
		}
	}

	@MessagePattern('request-list')
	async getByListStatus(
		body: GetRequestsMQDTO,
	): Promise<MicroserviceResponseFormatter<IRequestList>> {
		try {
			if (!body.ownerId && !body.userId) {
				body.ownerId = body.user._id
			}

			const list = await this.getListByStatusUseCase.handler(
				body.userId,
				body.ownerId,
				body.status,
				body.startAt,
			)

			return new MicroserviceResponseFormatter<IRequestList>(
				true,
				HttpStatus.OK,
				body,
				list,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IRequestList>().buildFromException(
				err,
				body,
			)
		}
	}

	@MessagePattern('request-patch')
	async update(
		body: PatchRequestMQDTO,
	): Promise<MicroserviceResponseFormatter<IRequest>> {
		try {
			const request = await this.patchRequestUseCase.handler(
				body.user._id,
				body.requestId,
				body.status,
			)

			return new MicroserviceResponseFormatter<IRequest>(
				true,
				HttpStatus.OK,
				body,
				request,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IRequest>().buildFromException(
				err,
				body,
			)
		}
	}

	@MessagePattern('request-get')
	async getById(
		requestId: string,
	): Promise<MicroserviceResponseFormatter<IRequestInfos>> {
		try {
			const request = await this.getByIdUseCase.handler(requestId)

			return new MicroserviceResponseFormatter<IRequestInfos>(
				true,
				HttpStatus.OK,
				{ requestId },
				request,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IRequestInfos>().buildFromException(
				err,
				{ requestId },
			)
		}
	}
}
