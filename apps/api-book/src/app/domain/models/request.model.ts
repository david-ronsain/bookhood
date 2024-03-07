import { IRequest, IRequestEvent, RequestStatus } from '@bookhood/shared'
import mongoose from 'mongoose'

export default class RequestModel {
	constructor(request?: IRequest) {
		if (request) {
			this._id = request._id?.toString()
			this.libraryId = new mongoose.Types.ObjectId(request.libraryId)
			this.userId = new mongoose.Types.ObjectId(request.userId)
			this.ownerId = new mongoose.Types.ObjectId(request.ownerId)
			this.startDate = request.startDate
			this.endDate = request.endDate
			this.status = request.status
			this.events = request.events
		}
	}

	readonly _id?: string

	readonly libraryId: mongoose.Types.ObjectId

	readonly userId: mongoose.Types.ObjectId

	readonly ownerId: mongoose.Types.ObjectId

	readonly status: RequestStatus

	readonly startDate?: string

	readonly endDate?: string

	readonly events: IRequestEvent[]
}
