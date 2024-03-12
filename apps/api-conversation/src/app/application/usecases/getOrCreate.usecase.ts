import { ForbiddenException, Inject } from '@nestjs/common'
import { ConversationRepository } from '../../domain/ports/conversation.repository'
import ConversationModel from '../../domain/models/conversation.model'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import {
	MQRequestMessageType,
	MicroserviceResponseFormatter,
} from '@bookhood/shared-api'
import { IConversationFull, IRequestInfos } from '@bookhood/shared'
import { v4 } from 'uuid'

export default class GetOrCreateUseCase {
	constructor(
		@Inject('ConversationRepository')
		private readonly conversationRepository: ConversationRepository,
		@Inject('RabbitBook') private readonly bookClient: ClientProxy,
	) {}

	async handler(
		requestId: string,
		userId: string,
	): Promise<IConversationFull> {
		let conversation = await this.conversationRepository.getByRequestId(
			undefined,
			requestId,
		)

		if (!conversation) {
			const request = await firstValueFrom<
				MicroserviceResponseFormatter<IRequestInfos>
			>(this.bookClient.send(MQRequestMessageType.GET, requestId))

			let roomId: string
			do {
				roomId = v4()
			} while (await this.conversationRepository.roomIdExists(roomId))

			const conv = new ConversationModel({
				requestId,
				messages: [],
				users: [request.data.emitter._id, request.data.owner._id],
				roomId: roomId,
			})
			await this.conversationRepository.create(conv)

			conversation = await this.conversationRepository.getByRequestId(
				undefined,
				requestId,
			)
		} else if (
			![
				conversation.request.emitter._id.toString(),
				conversation.request.owner._id.toString(),
			].includes(userId)
		) {
			throw new ForbiddenException(
				"You don't have access to this conversation",
			)
		}

		return conversation
	}
}
