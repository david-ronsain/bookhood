import { Inject, UseGuards } from '@nestjs/common'
import { Logger } from 'winston'
import { ClientProxy } from '@nestjs/microservices'
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

import { Server, Socket } from 'socket.io'
import { firstValueFrom } from 'rxjs'
import {
	MicroserviceResponseFormatter,
	MQConversationMessageType,
} from '@bookhood/shared-api'
import {
	AddMessageDTO,
	FlagAsSeenMessageDTO,
	GetOrCreateConversationDTO,
	IConversationFull,
	IConversationMessage,
	Locale,
	Role,
	WSConversationEventType,
	WritingDTO,
} from '@bookhood/shared'
import envConfig from '../../../config/env.config'
import { AuthUserGuard } from '../guards/authUser.guard'
import { RoleGuard } from '../guards/role.guard'
import { SocketHeaders } from '../decorators/socket.decorator'

@WebSocketGateway(envConfig().socket.port, { cors: true })
export class ConversationGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
		@Inject('RabbitConversation')
		private readonly conversationQueue: ClientProxy,
	) {}

	@WebSocketServer() io: Server

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	handleConnection(client: Socket, ...args: any[]) {
		const { sockets } = this.io.sockets

		this.logger.info(`Client id: ${client.id} connected`)
		this.logger.debug(`Number of connected clients: ${sockets.size}`)
	}

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	handleDisconnect(client: Socket) {
		client.broadcast.emit(WSConversationEventType.NOT_WRITING, {
			userId: client.data.userId,
		})
		this.logger.info(`Cliend id:${client.id} disconnected`)
	}

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	@SubscribeMessage(WSConversationEventType.CONNECT)
	async getOrCreateConversation(
		@ConnectedSocket() client: Socket,
		@SocketHeaders(envConfig().i18n.localeToken) locale: Locale,
		@SocketHeaders(envConfig().settings.sessionToken) token: string,
		@MessageBody() dto: GetOrCreateConversationDTO,
	) {
		try {
			const conversation = await firstValueFrom<
				MicroserviceResponseFormatter<IConversationFull>
			>(
				this.conversationQueue.send(
					MQConversationMessageType.CREATE_AND_GET,
					{
						...dto,
						session: {
							locale,
							token,
						},
					},
				),
			)

			client.data.roomId = conversation.data.roomId
			client.join(conversation.data.roomId)
			client.emit(WSConversationEventType.READ_SUCCESS, conversation)
		} catch (err) {
			client.emit(WSConversationEventType.READ_ACCESS_FORBIDDEN)
		}
	}

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	@SubscribeMessage(WSConversationEventType.ADD_MESSAGE)
	async addMessage(
		@ConnectedSocket() client: Socket,
		@SocketHeaders(envConfig().i18n.localeToken) locale: Locale,
		@SocketHeaders(envConfig().settings.sessionToken) token: string,
		@MessageBody() dto: AddMessageDTO,
	) {
		try {
			const message = await firstValueFrom<
				MicroserviceResponseFormatter<IConversationMessage>
			>(
				this.conversationQueue.send(
					MQConversationMessageType.ADD_MESSAGE,
					{
						...dto,
						session: {
							locale,
							token,
						},
					},
				),
			)

			client.nsp
				.to(dto.roomId)
				.emit(WSConversationEventType.GET_MESSAGE, message)
		} catch (err) {
			client.emit(WSConversationEventType.ADD_MESSAGE_FAILED)
		}
	}

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	@SubscribeMessage(WSConversationEventType.FLAG_MESSAGE_SEEN)
	async flagAsSeen(
		@ConnectedSocket() client: Socket,
		@SocketHeaders(envConfig().i18n.localeToken) locale: Locale,
		@SocketHeaders(envConfig().settings.sessionToken) token: string,
		@MessageBody() dto: FlagAsSeenMessageDTO,
	) {
		try {
			await firstValueFrom<MicroserviceResponseFormatter<boolean>>(
				this.conversationQueue.send(
					MQConversationMessageType.FLAG_AS_SEEN,
					{
						...dto,
						session: {
							locale,
							token,
						},
					},
				),
			)
			client.broadcast.emit(
				WSConversationEventType.FLAG_MESSAGE_SEEN_SUCCESS,
				dto,
			)
		} catch (err) {
			client.emit(WSConversationEventType.FLAG_MESSAGE_SEEN_ERROR)
		}
	}

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	@SubscribeMessage(WSConversationEventType.IS_WRITING)
	async isWriting(
		@ConnectedSocket() client: Socket,
		@MessageBody() dto: WritingDTO,
	) {
		client.data.userId = dto.userId
		client.broadcast.emit(WSConversationEventType.IS_WRITING_SUCCESS, dto)
	}

	@UseGuards(AuthUserGuard, new RoleGuard([Role.USER, Role.GUEST]))
	@SubscribeMessage(WSConversationEventType.NOT_WRITING)
	async isNotWriting(
		@ConnectedSocket() client: Socket,
		@MessageBody() dto: WritingDTO,
	) {
		client.data.userId = undefined
		client.broadcast.emit(WSConversationEventType.NOT_WRITING_SUCCESS, dto)
	}
}
