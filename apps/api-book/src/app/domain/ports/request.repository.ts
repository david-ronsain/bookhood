import {
	IRequestEvent,
	IRequestInfos,
	IRequestList,
	RequestStatus,
} from '@bookhood/shared'
import RequestModel from '../models/request.model'

export interface RequestRepository {
	getListByStatus(
		userId: string,
		ownerId: string,
		status: RequestStatus,
		startAt: number,
	): Promise<IRequestList>

	create(request: RequestModel): Promise<RequestModel>

	countActiveRequestsForUser(userId: string): Promise<number>

	getById(requestId: string): Promise<RequestModel | null>

	patch(
		requestId: string,
		status: RequestStatus,
		events: IRequestEvent[],
	): Promise<RequestModel>

	getRequestInfos(requestId: string): Promise<IRequestInfos | null>
}
