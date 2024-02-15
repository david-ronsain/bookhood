import {
	Controller,
	ForbiddenException,
	HttpStatus,
	Inject,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import {
	IUser,
	IRequest,
	BookRequestMailDTO,
	IRequestList,
} from '@bookhood/shared'
import {
	MicroserviceResponseFormatter,
	PatchRequestMQDTO,
} from '@bookhood/shared-api'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { firstValueFrom } from 'rxjs'
import CreateRequestUseCase from '../usecases/request/createRequest.usecase'
import GetUserBookUseCase from '../usecases/book/getUserBook.usecase'
import { CreateRequestDTO, GetRequestsDTO } from '../dto/request.dto'
import GetListByStatusUseCase from '../usecases/request/getListByStatus.usecase'
import PatchRequestUseCase from '../usecases/request/patchRequest.usecase'

@Controller()
export class RequestController {
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitUser') private readonly userClient: ClientProxy,
		@Inject('RabbitMail') private readonly mailClient: ClientProxy,
		private readonly getUserBookUseCase: GetUserBookUseCase,
		private readonly createRequestUseCase: CreateRequestUseCase,
		private readonly getListByStatusUseCase: GetListByStatusUseCase,
		private readonly patchRequestUseCase: PatchRequestUseCase,
	) {}

	@MessagePattern('request-create')
	async create(
		body: CreateRequestDTO,
	): Promise<MicroserviceResponseFormatter<IRequest>> {
		try {
			const userData = await this.checkUserToken(body.token)
			const library = await this.getUserBookUseCase.handler(
				body.libraryId,
			)

			const request = await this.createRequestUseCase.handler(
				userData._id,
				body.libraryId,
			)

			this.mailClient
				.send('mail-request-created', {
					book: library.book.title,
					emitterFirstName: userData.firstName,
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
		body: GetRequestsDTO,
	): Promise<MicroserviceResponseFormatter<IRequestList>> {
		try {
			const user = await this.checkUserToken(body.token)

			if (!body.ownerId && !body.userId) {
				body.ownerId = user._id
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
			const user = await this.checkUserToken(body.token)

			const request = await this.patchRequestUseCase.handler(
				user._id,
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
			console.log(err)
			return new MicroserviceResponseFormatter<IRequest>().buildFromException(
				err,
				body,
			)
		}
	}

	private async checkUserToken(requestToken: string): Promise<IUser> {
		const token = requestToken?.split('|') ?? []
		if (token.length === 3) {
			token.pop()
		}

		const userData = await firstValueFrom<
			MicroserviceResponseFormatter<IUser | null>
		>(this.userClient.send('user-get-by-token', token.join('|')))
		if (!userData.success) {
			throw new ForbiddenException()
		}

		return userData.data
	}
}
