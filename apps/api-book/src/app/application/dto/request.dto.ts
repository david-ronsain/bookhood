import { IGetRequests } from '@bookhood/shared'

export interface CreateRequestDTO {
	token: string

	libraryId: string
}

export interface GetRequestsDTO extends IGetRequests {
	token: string

	startAt: number
}
