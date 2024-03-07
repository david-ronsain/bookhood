import { IRequest } from '@bookhood/shared'
import { RequestEntity } from '../../infrastructure/adapters/repository/entities/request.entity'
import RequestModel from '../../domain/models/request.model'

export default class RequestMapper {
	public static fromEntitytoModel(
		requestEntity: RequestEntity,
	): RequestModel {
		return new RequestModel({
			_id: requestEntity._id,
			libraryId: requestEntity.libraryId,
			userId: requestEntity.userId,
			ownerId: requestEntity.ownerId,
			status: requestEntity.status,
			events: requestEntity.events,
			startDate: requestEntity.startDate,
			endDate: requestEntity.endDate,
		})
	}

	public static modelObjectIdToString(request: RequestModel): IRequest {
		return {
			...request,
			_id: request._id.toString(),
			userId: request.userId.toString(),
			ownerId: request.ownerId.toString(),
			libraryId: request.libraryId.toString(),
		} as IRequest
	}
}
