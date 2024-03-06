import { IGetRequests, IPatchRequestDTO, RequestStatus } from '@bookhood/shared'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'
import { DTOWithAuth } from './common.dto'

export class PatchRequestDTO implements IPatchRequestDTO {
	@IsNotEmpty()
	@IsEnum(RequestStatus)
	status: RequestStatus
}

export class PatchRequestMQDTO extends DTOWithAuth implements IPatchRequestDTO {
	@IsNotEmpty()
	@IsEnum(RequestStatus)
	status: RequestStatus

	@IsNotEmpty()
	@IsString()
	requestId: string
}

export interface CreateRequestMQDTO extends DTOWithAuth {
	libraryId: string
}

export class GetRequestsMQDTO extends DTOWithAuth implements IGetRequests {
	status?: RequestStatus

	ownerId?: string

	userId?: string

	startAt: number
}
