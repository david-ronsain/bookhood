import {
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator'
import { IRequestInfos } from './request.interface'
import { Locale } from '../enums'

export class TokenDTO {
	@IsNotEmpty()
	@IsString()
	token: string
}

export class SessionDTO {
	@IsNotEmpty()
	@IsString()
	token: string

	@IsOptional()
	@IsEnum(Locale)
	locale: Locale.FR
}

export class GetOrCreateConversationDTO {
	@IsNotEmpty()
	@IsString()
	requestId: string

	@IsOptional()
	@IsObject()
	session?: SessionDTO
}

export class AddMessageDTO {
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

	@IsOptional()
	@IsObject()
	session?: SessionDTO
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

export class FlagAsSeenMessageDTO {
	@IsNotEmpty()
	@IsString()
	messageId: string

	@IsNotEmpty()
	@IsString()
	conversationId: string

	@IsOptional()
	@IsString()
	userId: string

	@IsOptional()
	@IsObject()
	session?: SessionDTO
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
