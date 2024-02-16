import { IGetRequests, RequestStatus } from '@bookhood/shared'

export interface CreateRequestDTO {
	token: string

	libraryId: string
}

export class GetRequestsDTO implements IGetRequests {
	status?: RequestStatus

	ownerId?: string

	userId?: string

	token: string

	startAt: number
}
