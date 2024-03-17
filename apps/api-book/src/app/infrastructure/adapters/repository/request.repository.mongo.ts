import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import mongoose, { Model, PipelineStage } from 'mongoose'
import { RequestRepository } from '../../../domain/ports/request.repository'
import RequestModel from '../../../domain/models/request.model'
import {
	IRequestEvent,
	IRequestInfos,
	IRequestList,
	RequestStatus,
} from '@bookhood/shared'
import RequestMapper from '../../../application/mappers/request.mapper'
import { RequestEntity } from './entities/request.entity'
import { UserRequestStats } from '@bookhood/shared-api'

@Injectable()
export default class RequestRepositoryMongo implements RequestRepository {
	constructor(
		@InjectModel('Request')
		private readonly requestModel: Model<RequestEntity>,
	) {}

	async countActiveRequestsForUser(
		userId: string,
		dates: string[],
		requestId?: string,
	): Promise<number> {
		const filters = {
			userId: new mongoose.Types.ObjectId(userId),
			$or: [
				{
					status: {
						$in: [
							RequestStatus.ACCEPTED_PENDING_DELIVERY,
							RequestStatus.RECEIVED,
							RequestStatus.RETURN_PENDING,
							RequestStatus.RETURNED_WITH_ISSUE,
						],
					},
				},
				{
					$and: [
						{ startDate: { $gte: dates[0] } },
						{ endDate: { $lte: dates[0] } },
					],
				},
				{
					$and: [
						{ startDate: { $gte: dates[1] } },
						{ endDate: { $lte: dates[1] } },
					],
				},
				{
					$and: [
						{ startDate: { $lte: dates[0] } },
						{ endDate: { $gte: dates[1] } },
					],
				},
			],
		}

		if (requestId) {
			filters['_id'] = {
				$ne: new mongoose.Types.ObjectId(requestId),
			}
		}

		return this.requestModel.countDocuments(filters)
	}

	async create(request: RequestModel): Promise<RequestModel> {
		const req = await this.requestModel.create(request)

		return RequestMapper.fromEntitytoModel(req)
	}

	async getListByStatus(
		userId: string,
		ownerId: string,
		status: RequestStatus,
		startAt: number,
	): Promise<IRequestList> {
		const filters = {}

		if (userId) {
			filters['userId'] = new mongoose.Types.ObjectId(userId)
		}

		if (ownerId) {
			filters['ownerId'] = new mongoose.Types.ObjectId(ownerId)
		}

		if (status) {
			filters['status'] = status
		}

		const stages: PipelineStage[] = [
			{
				$match: filters,
			},
			{
				$lookup: {
					from: 'users',
					localField: 'userId',
					foreignField: '_id',
					as: 'user',
				},
			},
			{
				$unwind: {
					path: '$user',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'ownerId',
					foreignField: '_id',
					as: 'owner',
				},
			},
			{
				$unwind: {
					path: '$owner',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$lookup: {
					from: 'libraries',
					localField: 'libraryId',
					foreignField: '_id',
					as: 'library',
				},
			},
			{
				$unwind: {
					path: '$library',
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$lookup: {
					from: 'books',
					localField: 'library.bookId',
					foreignField: '_id',
					as: 'book',
				},
			},
			{
				$unwind: {
					path: '$book',
					preserveNullAndEmptyArrays: false,
				},
			},
		]

		if (userId) {
			stages.push({
				$lookup: {
					from: 'requests',
					localField: 'library._id',
					foreignField: 'libraryId',
					as: 'requests',
					pipeline: [
						{
							$match: {
								userId: {
									$ne: new mongoose.Types.ObjectId(userId),
								},
								status: {
									$nin: [
										RequestStatus.PENDING_VALIDATION,
										RequestStatus.RETURN_ACCEPTED,
									],
								},
								endDate: { $gte: new Date() },
							},
						},
						{
							$project: {
								_id: true,
								startDate: true,
								endDate: true,
							},
						},
					],
				},
			})
		}

		stages.push(
			{
				$project: {
					_id: true,
					createdAt: true,
					startDate: true,
					endDate: true,
					status: true,
					userFirstName: '$user.firstName',
					ownerFirstName: '$owner.firstName',
					title: '$book.title',
					place: '$library.place',
					userId: '$user._id',
					ownerId: '$owner._id',
					requests: true,
				},
			},
			{
				$skip: parseInt(startAt.toString()),
			},
			{
				$limit: 10,
			},
			{
				$group: {
					_id: null,
					results: {
						$push: '$$ROOT',
					},
					total: {
						$sum: 1,
					},
				},
			},
			{
				$project: {
					_id: false,
				},
			},
		)

		return this.requestModel
			.aggregate(stages)
			.then((results: IRequestList[]) =>
				results.length ? results[0] : { results: [], total: 0 },
			)
	}

	async getById(requestId: string): Promise<RequestModel | null> {
		const request = await this.requestModel.findById(requestId)

		return request ? RequestMapper.fromEntitytoModel(request) : null
	}

	async patch(
		requestId: string,
		status: RequestStatus,
		events: IRequestEvent[],
		startDate?: string,
		endDate?: string,
	): Promise<RequestModel> {
		const dataToUpdate = { status, events }
		if (startDate) {
			dataToUpdate['startDate'] = startDate
		}
		if (endDate) {
			dataToUpdate['endDate'] = endDate
		}

		const updated = await this.requestModel.findByIdAndUpdate(
			new mongoose.Types.ObjectId(requestId),
			dataToUpdate,
			{ new: true },
		)

		return updated ? RequestMapper.fromEntitytoModel(updated) : null
	}

	async getRequestInfos(requestId: string): Promise<IRequestInfos | null> {
		return this.requestModel
			.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(requestId),
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						as: 'emitter',
					},
				},
				{
					$unwind: {
						path: '$emitter',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'ownerId',
						foreignField: '_id',
						as: 'owner',
					},
				},
				{
					$unwind: {
						path: '$owner',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'libraries',
						localField: 'libraryId',
						foreignField: '_id',
						as: 'library',
					},
				},
				{
					$unwind: {
						path: '$library',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'books',
						localField: 'library.bookId',
						foreignField: '_id',
						as: 'book',
					},
				},
				{
					$unwind: {
						path: '$book',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$project: {
						_id: true,
						createdAt: true,
						'emitter.firstName': true,
						'emitter.lastName': true,
						'emitter.email': true,
						'emitter._id': true,
						'owner.firstName': true,
						'owner.lastName': true,
						'owner.email': true,
						'owner._id': true,
						'book.title': true,
					},
				},
			])
			.then((results: IRequestInfos[]) =>
				results.length
					? { ...results[0], _id: results[0]._id.toString() }
					: null,
			)
	}

	async getStats(userId: string): Promise<UserRequestStats | null> {
		return this.requestModel
			.aggregate([
				{
					$facet: {
						nbOutgoingRequests: [
							{
								$match: {
									userId: new mongoose.Types.ObjectId(userId),
								},
							},
							{
								$group: {
									_id: null,
									total: {
										$sum: 1,
									},
								},
							},
						],
						nbIncomingRequests: [
							{
								$match: {
									ownerId: new mongoose.Types.ObjectId(
										userId,
									),
								},
							},
							{
								$group: {
									_id: null,
									total: {
										$sum: 1,
									},
								},
							},
						],
					},
				},
				{
					$project: {
						nbOutgoingRequests: {
							$ifNull: [
								{
									$first: '$nbOutgoingRequests.total',
								},
								0,
							],
						},
						nbIncomingRequests: {
							$ifNull: [
								{
									$first: '$nbIncomingRequests.total',
								},
								0,
							],
						},
					},
				},
			])
			.then((results: UserRequestStats[]) =>
				results.length ? results[0] : null,
			)
	}
}
