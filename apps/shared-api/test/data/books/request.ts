/* eslint-disable @nx/enforce-module-boundaries */
import mongoose from 'mongoose'
import RequestModel from '../../../../api-book/src/app/domain/models/request.model'
import {
	IRequest,
	IRequestInfos,
	IRequestList,
	IRequestSimple,
	RequestStatus,
} from '../../../../shared/src'
import { UserRequestStats } from '../../../src'

export const userRequestStats: UserRequestStats = {
	nbIncomingRequests: 1,
	nbOutgoingRequests: 2,
}

export const requestInfos: IRequestInfos = {
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
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
}

export const requestsInfos: IRequestInfos[] = [requestInfos]

export const requestEntity = {
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
	libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
	userId: 'cccccccccccccccccccccccc',
	ownerId: 'dddddddddddddddddddddddd',
	dueDate: new Date().toString(),
	status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
	events: [
		{
			oldStatus: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			currentStatus: RequestStatus.REFUSED,
			date: new Date().toString(),
			userId: 'owner_id',
		},
	],
}

export const requestSimple: IRequestSimple = {
	_id: 'request_id',
	userFirstName: 'userFirstName',
	ownerFirstName: 'ownerFirstName',
	title: 'title',
	place: 'Paris',
	userId: 'user_id',
	ownerId: 'owner_id',
	createdAt: new Date().toString(),
	startDate: new Date().toString(),
	endDate: new Date().toString(),
}

export const requestList: IRequestList = {
	total: 1,
	results: [requestSimple],
}

export const emptyRequestList: IRequestList = {
	total: 0,
	results: [],
}

export const requestsList: IRequestList[] = [requestList]

export const request: IRequest = {
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
	libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
	ownerId: 'cccccccccccccccccccccccc',
	userId: 'dddddddddddddddddddddddd',
	status: RequestStatus.PENDING_VALIDATION,
}

export const requestModel: RequestModel = {
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
	libraryId: new mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb'),
	userId: new mongoose.Types.ObjectId('cccccccccccccccccccccccc'),
	ownerId: new mongoose.Types.ObjectId('dddddddddddddddddddddddd'),
	status: RequestStatus.REFUSED,
	events: [],
}

export const requestRepository = {
	create: jest.fn(),
	countActiveRequestsForUser: jest.fn(),
	getRequestInfos: jest.fn(),
	getListByStatus: jest.fn(),
	getStats: jest.fn(),
	getById: jest.fn(),
	patch: jest.fn(),
}
