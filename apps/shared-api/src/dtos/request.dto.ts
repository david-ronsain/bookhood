import { IGetRequests, IPatchRequestDTO, RequestStatus } from '@bookhood/shared'
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator'
import { DTOWithAuth } from './common.dto'

export class PatchRequestDTO implements IPatchRequestDTO {
	@IsNotEmpty()
	@IsEnum(RequestStatus)
	status: RequestStatus

	@IsOptional()
	@IsArray()
	@IsDateString({ strict: false }, { each: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	dates?: string[]
}

export class PatchRequestMQDTO extends DTOWithAuth implements IPatchRequestDTO {
	@IsNotEmpty()
	@IsEnum(RequestStatus)
	status: RequestStatus

	@IsNotEmpty()
	@IsString()
	requestId: string

	@IsOptional()
	@IsArray()
	@IsDateString({ strict: false }, { each: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	dates?: string[]
}

export interface CreateRequestMQDTO extends DTOWithAuth {
	libraryId: string

	dates: string[]
}

export class GetRequestsMQDTO extends DTOWithAuth implements IGetRequests {
	status?: RequestStatus

	ownerId?: string

	userId?: string

	startAt: number
}
