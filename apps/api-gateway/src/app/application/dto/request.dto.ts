import { IGetRequests, RequestStatus } from '@bookhood/shared'
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

export class GetRequestsDTO implements IGetRequests {
	@IsOptional()
	@IsEnum(RequestStatus)
	status: RequestStatus

	@IsOptional()
	@IsString()
	ownerId: string

	@IsOptional()
	@IsString()
	userId: string

	@IsNotEmpty()
	@IsNumberString()
	startAt: number
}

export class CreateRequestDTO {
	@IsArray()
	@IsDateString({ strict: false }, { each: true })
	@ArrayMinSize(2)
	@ArrayMaxSize(2)
	dates: string[]
}
