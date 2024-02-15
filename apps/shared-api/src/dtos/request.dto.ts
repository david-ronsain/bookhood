import { IPatchRequestDTO, RequestStatus } from '@bookhood/shared'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class PatchRequestDTO implements IPatchRequestDTO {
	@IsNotEmpty()
	@IsEnum(RequestStatus)
	status: RequestStatus
}

export class PatchRequestMQDTO extends PatchRequestDTO {
	@IsNotEmpty()
	@IsString()
	token: string

	@IsNotEmpty()
	@IsString()
	requestId: string
}
