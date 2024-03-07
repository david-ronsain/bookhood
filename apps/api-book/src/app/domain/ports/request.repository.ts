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

	countActiveRequestsForUser(
		userId: string,
		dates: string[],
		requestId?: string,
	): Promise<number>

	getById(requestId: string): Promise<RequestModel | null>

	patch(
		requestId: string,
		status: RequestStatus,
		events: IRequestEvent[],
		startDate?: string,
		endDate?: string,
	): Promise<RequestModel>

	getRequestInfos(requestId: string): Promise<IRequestInfos | null>
}
