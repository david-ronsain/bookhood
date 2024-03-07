import { IRequest, IRequestEvent, RequestStatus } from '@bookhood/shared'
import { Document } from 'mongoose'

export interface RequestEntity extends Document, IRequest {
	readonly _id: string

	readonly libraryId: string

	readonly userId: string

	readonly ownerId: string

	readonly status: RequestStatus

	readonly startDate?: string

	readonly endDate?: string

	readonly events: IRequestEvent[]

	readonly createdAt: string

	readonly updatedAt: string
}
