import { Inject } from '@nestjs/common'
import { Logger } from 'winston'
import { ClientProxy } from '@nestjs/microservices'
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import { Server, Socket } from 'socket.io'
import { firstValueFrom } from 'rxjs'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import {
	AddMessageDTO,
	GetOrCreateConversationDTO,
	IConversationFull,
	IConversationMessage,
} from '@bookhood/shared'
import envConfig from '../../../config/env.config'

@WebSocketGateway(envConfig().socket.port, { cors: true })
export class ConversationGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitConversation')
		private readonly conversationQueue: ClientProxy,
	) {}

	@WebSocketServer() io: Server

	afterInit() {
		this.logger.info('initialized')
	}

	handleConnection(client: Socket, ...args: any[]) {
		const { sockets } = this.io.sockets

		this.logger.info(`Client id: ${client.id} connected`)
		this.logger.debug(`Number of connected clients: ${sockets.size}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.info(`Cliend id:${client.id} disconnected`)
	}

	@SubscribeMessage('conversation-connect')
	async getOrCreateConversation(
		client: Socket,
		dto: GetOrCreateConversationDTO,
	) {
		try {
			this.logger.info(`Message received from client id: ${client.id}`)
			this.logger.info(`Payload: ${dto.token}`)

			const conversation = await firstValueFrom<
				MicroserviceResponseFormatter<IConversationFull>
			>(this.conversationQueue.send('conversation-get-or-create', dto))

			client.join(conversation.data.roomId)

			client.emit('conversation', conversation)
		} catch (err) {
			client.emit('conversation-access-forbidden')
		}
	}

	@SubscribeMessage('conversation-add-message')
	async addMessage(client: Socket, dto: AddMessageDTO) {
		try {
			this.logger.info(`Message received from client id: ${client.id}`)
			this.logger.info(`Payload: ${dto.message}`)

			const message = await firstValueFrom<
				MicroserviceResponseFormatter<IConversationMessage>
			>(this.conversationQueue.send('conversation-add-message', dto))

			client.nsp.to(dto.roomId).emit('conversation-message', message)
		} catch (err) {
			client.emit('conversation-add-message-error')
		}
	}
}
