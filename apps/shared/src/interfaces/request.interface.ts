import { RequestStatus } from '../enums'

export interface IRequest {
	_id?: string

	libraryId: string

	userId: string

	ownerId: string

	status: RequestStatus

	dueDate?: string

	events?: IRequestEvent[]
}

export interface IRequestEvent {
	oldStatus?: RequestStatus

	currentStatus: RequestStatus

	date: string

	userId: string
}

export interface IRequestSimple {
	_id: string

	userFirstName: string

	ownerFirstName: string

	title: string

	dueDate?: string

	place: string

	createdAt: string

	userId: string

	ownerId: string
}

export interface IRequestList {
	results: IRequestSimple[]

	total: number
}

export interface IPatchRequestDTO {
	status: RequestStatus
}

interface IRequestInfosUser {
	_id?: string

	firstName: string

	lastName: string

	email: string
}

interface IRequestInfosBook {
	title: string
}

export interface IRequestInfos {
	_id: string

	createdAt: string

	owner: IRequestInfosUser

	emitter: IRequestInfosUser

	book: IRequestInfosBook
}

export interface IGetRequests {
	status?: RequestStatus

	ownerId?: string

	userId?: string
}
