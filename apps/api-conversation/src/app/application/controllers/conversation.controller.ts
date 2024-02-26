import {
	Controller,
	ForbiddenException,
	HttpStatus,
	Inject,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import {
	AddMessageDTO,
	GetOrCreateConversationDTO,
	IConversation,
	IConversationFull,
	IConversationMessage,
	IUser,
} from '@bookhood/shared'
import { firstValueFrom } from 'rxjs'
import { Logger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import GetOrCreateUseCase from '../usecases/getOrCreate.usecase'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import AddMessageUseCase from '../usecases/addMessage.usecase'

@Controller()
export class ConversationController {
	constructor(
		@Inject('RabbitUser') private readonly userClient: ClientProxy,
		private readonly getOrCreateUseCase: GetOrCreateUseCase,
		private readonly addMessageUseCase: AddMessageUseCase,
	) {}

	@MessagePattern('conversation-health')
	health(): string {
		return 'up'
	}

	@MessagePattern('conversation-get-or-create')
	async getOrCreateConversation(
		dto: GetOrCreateConversationDTO,
	): Promise<MicroserviceResponseFormatter<IConversationFull>> {
		try {
			await this.checkUserToken(dto.token)

			const conversation = await this.getOrCreateUseCase.handler(
				dto.requestId,
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

	@MessagePattern('conversation-add-message')
	async addMessage(
		dto: AddMessageDTO,
	): Promise<MicroserviceResponseFormatter<IConversationMessage>> {
		try {
			await this.checkUserToken(dto.token)

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
