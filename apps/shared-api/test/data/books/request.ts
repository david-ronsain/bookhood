/* eslint-disable @nx/enforce-module-boundaries */
import {
	IRequestInfos,
	IRequestList,
	RequestStatus,
} from '../../../../shared/src'
import { UserRequestStats } from '../../../src'

export const userRequestStats: UserRequestStats = {
	nbIncomingRequests: 1,
	nbOutgoingRequests: 2,
}

export const requestInfos: IRequestInfos[] = [
	{
		_id: 'request_id',
		createdAt: new Date().toString(),
		emitter: {
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
		},
		owner: {
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
		},
		book: {
			title: 'Sample Book',
		},
	},
]

export const requestEntity = {
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
	libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
	userId: 'cccccccccccccccccccccccc',
	ownerId: 'dddddddddddddddddddddddd',
	dueDate: new Date().toString(),
	status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
	events: [],
}

export const requestsList: IRequestList[] = [
	{
		total: 1,
		results: [
			{
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				userFirstName: 'first1',
				ownerFirstName: 'first2',
				title: 'title',
				place: 'Some place',
				startDate: new Date().toString(),
				endDate: new Date().toString(),
				createdAt: new Date().toString(),
				userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				ownerId: 'cccccccccccccccccccccccc',
			},
		],
	},
]
