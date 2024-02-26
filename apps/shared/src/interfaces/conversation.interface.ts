import { IsNotEmpty, IsString } from 'class-validator'
import { IRequestInfos } from './request.interface'

export class TokenDTO {
	@IsNotEmpty()
	@IsString()
	token: string
}

export class GetOrCreateConversationDTO extends TokenDTO {
	@IsNotEmpty()
	@IsString()
	requestId: string
}

export class AddMessageDTO extends TokenDTO {
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
}

export interface IConversationFull {
	_id: string

	request: IRequestInfos

	roomId: string

	messages: IConversationMessage[]
}
