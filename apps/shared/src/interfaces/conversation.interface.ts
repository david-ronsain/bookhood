import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'
import { IRequestInfos } from './request.interface'
import { Session } from './session.interface'

export class TokenDTO {
	@IsNotEmpty()
	@IsString()
	token: string
}

export class GetOrCreateConversationDTO extends Session {
	@IsNotEmpty()
	@IsString()
	requestId: string
}

export class AddMessageDTO extends Session {
	@IsNotEmpty()
	@IsString()
	_id: string

	@IsNotEmpty()
	@IsString()
	message: string

	@IsNotEmpty()
	@IsString()
	userId: string

	@IsNotEmpty()
	@IsString()
	requestId: string

	@IsNotEmpty()
	@IsString()
	roomId: string
}

export interface IConversation {
	_id?: string

	requestId: string

	roomId: string

	users: string[]

	messages: IConversationMessage[]
}

export interface IConversationMessage {
	_id?: string

	message: string

	from: string

	seenBy: string[]
}

export interface IConversationFull {
	_id: string

	request: IRequestInfos

	roomId: string

	messages: IConversationMessage[]
}

export class FlagAsSeenMessageDTO extends Session {
	@IsNotEmpty()
	@IsString()
	messageId: string

	@IsNotEmpty()
	@IsString()
	conversationId: string

	@IsOptional()
	@IsString()
	userId: string
}

export class WritingDTO {
	@IsNotEmpty()
	@IsString()
	roomId: string

	@IsNotEmpty()
	@IsString()
	userId: string

	@IsOptional()
	@IsString()
	firstName?: string
}
