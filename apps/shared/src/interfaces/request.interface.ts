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
	id: string

	firstName: string

	title: string

	dueDate?: string

	place: string

	createdAt: string
}

export interface IRequestList {
	results: IRequestSimple[]

	total: number
}

export interface IPatchRequestDTO {
	status: RequestStatus
}

interface IRequestInfosUser {
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
