import {
	Controller,
	ForbiddenException,
	HttpStatus,
	Inject,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import {
	AddMessageDTO,
	FlagAsSeenMessageDTO,
	GetOrCreateConversationDTO,
	IConversationFull,
	IConversationMessage,
	IUser,
} from '@bookhood/shared'
import { firstValueFrom } from 'rxjs'
import GetOrCreateUseCase from '../usecases/getOrCreate.usecase'
import {
	MQConversationMessageType,
	MQUerMessageType,
	MicroserviceResponseFormatter,
} from '@bookhood/shared-api'
import AddMessageUseCase from '../usecases/addMessage.usecase'
import FlagAsSeenUseCase from '../usecases/flagAsSeen.usecase'

@Controller()
export class ConversationController {
	constructor(
		@Inject('RabbitUser') private readonly userClient: ClientProxy,
		private readonly getOrCreateUseCase: GetOrCreateUseCase,
		private readonly addMessageUseCase: AddMessageUseCase,
		private readonly flagAsSeenUseCase: FlagAsSeenUseCase,
	) {}

	@MessagePattern()
	health(): string {
		return 'up'
	}

	@MessagePattern(MQConversationMessageType.CREATE_AND_GET)
	async getOrCreateConversation(
		dto: GetOrCreateConversationDTO,
	): Promise<MicroserviceResponseFormatter<IConversationFull>> {
		try {
			const user = await this.checkUserToken(dto.token)

			const conversation = await this.getOrCreateUseCase.handler(
				dto.requestId,
				user._id,
			)

			return new MicroserviceResponseFormatter<IConversationFull>(
				true,
				HttpStatus.OK,
				undefined,
				conversation,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IConversationFull>().buildFromException(
				err,
				dto,
			)
		}
	}

	@MessagePattern(MQConversationMessageType.ADD_MESSAGE)
	async addMessage(
		dto: AddMessageDTO,
	): Promise<MicroserviceResponseFormatter<IConversationMessage>> {
		try {
			const user = await this.checkUserToken(dto.token)
			dto.userId = user._id

			const conversation = await this.addMessageUseCase.handler(dto)

			return new MicroserviceResponseFormatter<IConversationMessage>(
				true,
				HttpStatus.OK,
				undefined,
				conversation,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IConversationMessage>().buildFromException(
				err,
				dto,
			)
		}
	}

	@MessagePattern(MQConversationMessageType.FLAG_AS_SEEN)
	async flagAsSeen(
		dto: FlagAsSeenMessageDTO,
	): Promise<MicroserviceResponseFormatter<boolean>> {
		try {
			const user = await this.checkUserToken(dto.token)
			dto.userId = user._id

			await this.flagAsSeenUseCase.handler(dto)

			return new MicroserviceResponseFormatter<boolean>(
				true,
				HttpStatus.OK,
				undefined,
				true,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<boolean>().buildFromException(
				err,
				dto,
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
		>(this.userClient.send(MQUerMessageType.GET_BY_TOKEN, token.join('|')))
		if (!userData.success) {
			throw new ForbiddenException()
		}

		return userData.data
	}
}
