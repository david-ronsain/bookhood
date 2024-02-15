import { IGetRequests, RequestStatus } from '@bookhood/shared'
import {
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	IsString,
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
