import { RequestStatus } from '@bookhood/shared'

export interface CreateRequestDTO {
	token: string

	libraryId: string
}

export interface GetRequestsByStatusDTO {
	token: string

	status: RequestStatus

	startAt: number
}
