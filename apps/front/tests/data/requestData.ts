/* eslint-disable @nx/enforce-module-boundaries */
import { IRequest, IRequestList, RequestStatus } from '../../../shared/src'

export const requestsList: IRequestList = {
	total: 15,
	results: Array.from({ length: 15 }, (value: unknown, index: number) => ({
		_id: `reqId#${index}`,
		userFirstName: `first${index}`,
		ownerFirstName: `last${index}`,
		title: `title${index}`,
		place: `place${index}`,
		createdAt: new Date().toISOString(),
		userId: `userId#${index}`,
		ownerId: `ownerId#${index}`,
		status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
		startDate: `2024-03-10`,
		endDate: `2024-03-17`,
		requests: [
			{
				_id: `reqId#${index}-${index}`,
				userFirstName: `first${index}-${index}`,
				ownerFirstName: `last${index}-${index}`,
				title: `title${index}-${index}`,
				place: `place${index}-${index}`,
				createdAt: new Date().toISOString(),
				userId: `userId#${index}-${index}`,
				ownerId: `ownerId#${index}-${index}`,
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
				startDate: `2024-03-10`,
				endDate: `2024-03-17`,
			},
		],
	})),
}

export const request: IRequest = {
	_id: `reqId`,
	libraryId: 'libId',
	userId: 'userId',
	ownerId: 'ownerId',
	status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
	startDate: `2024-03-10`,
	endDate: `2024-03-17`,
}
