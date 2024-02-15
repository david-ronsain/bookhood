import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import mongoose, { Model } from 'mongoose'
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

@Injectable()
export default class RequestRepositoryMongo implements RequestRepository {
	constructor(
		@InjectModel('Request')
		private readonly requestModel: Model<RequestEntity>,
	) {}

	async countActiveRequestsForUser(userId: string): Promise<number> {
		return this.requestModel.countDocuments({
			userId: new mongoose.Types.ObjectId(userId),
			status: {
				$in: [
					RequestStatus.ACCEPTED_PENDING_DELIVERY,
					RequestStatus.RECEIVED,
					RequestStatus.RETURN_PENDING,
					RequestStatus.RETURNED_WITH_ISSUE,
				],
			},
		})
	}

	async create(request: RequestModel): Promise<RequestModel> {
		const req = await this.requestModel.create(request)

		return RequestMapper.fromEntitytoModel(req)
	}

	async getListByStatus(
		userId: string,
		status: RequestStatus,
		startAt: number,
	): Promise<IRequestList> {
		return this.requestModel
			.aggregate([
				{
					$match: {
						status,
						ownerId: new mongoose.Types.ObjectId(userId),
					},
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
						'user.firstName': true,
						'book.title': true,
						'library.place': true,
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$book', '$$ROOT'],
						},
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$user', '$$ROOT'],
						},
					},
				},
				{
					$replaceRoot: {
						newRoot: {
							$mergeObjects: ['$library', '$$ROOT'],
						},
					},
				},
				{
					$project: {
						user: false,
						library: false,
						book: false,
					},
				},
				{
					$skip: startAt,
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
			])
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
	): Promise<RequestModel> {
		const updated = await this.requestModel.findByIdAndUpdate(
			new mongoose.Types.ObjectId(requestId),
			{ status, events },
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
						'owner.firstName': true,
						'owner.lastName': true,
						'owner.email': true,
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
}
