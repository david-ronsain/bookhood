import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import mongoose, { Model } from 'mongoose'
import { ConversationRepository } from '../../../domain/ports/conversation.repository'
import { ConversationEntity } from './entities/conversation.entity'
import ConversationMapper from '../../../application/mappers/conversation.mapper'
import ConversationModel from '../../../domain/models/conversation.model'
import { IConversationFull, IConversationMessage } from '@bookhood/shared'
import ConversationMessageModel from '../../../domain/models/message.model'
import MessageMapper from '../../../application/mappers/message.mapper'

@Injectable()
export default class ConversationRepositoryMongo
	implements ConversationRepository
{
	constructor(
		@InjectModel('Conversation')
		private readonly conversationModel: Model<ConversationEntity>,
	) {}

	async getByRequestId(requestId: string): Promise<IConversationFull | null> {
		return this.conversationModel
			.aggregate([
				{
					$match: {
						requestId: new mongoose.Types.ObjectId(requestId),
					},
				},
				{
					$lookup: {
						from: 'requests',
						localField: 'requestId',
						foreignField: '_id',
						as: 'request',
					},
				},
				{
					$unwind: {
						path: '$request',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'request.userId',
						foreignField: '_id',
						as: 'request.emitter',
					},
				},
				{
					$unwind: {
						path: '$request.emitter',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'request.ownerId',
						foreignField: '_id',
						as: 'request.owner',
					},
				},
				{
					$unwind: {
						path: '$request.owner',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'libraries',
						localField: 'request.libraryId',
						foreignField: '_id',
						as: 'request.library',
					},
				},
				{
					$unwind: {
						path: '$request.library',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$lookup: {
						from: 'books',
						localField: 'request.library.bookId',
						foreignField: '_id',
						as: 'request.book',
					},
				},
				{
					$unwind: {
						path: '$request.book',
						preserveNullAndEmptyArrays: false,
					},
				},
				{
					$project: {
						_id: true,
						createdAt: true,
						messages: true,
						roomId: true,
						'request.emitter.firstName': true,
						'request.emitter.lastName': true,
						'request.emitter.email': true,
						'request.emitter._id': true,
						'request.owner.firstName': true,
						'request.owner.lastName': true,
						'request.owner.email': true,
						'request.owner._id': true,
						'request.book.title': true,
					},
				},
			])
			.then((results: IConversationFull[]) =>
				results.length ? results[0] : null,
			)
	}

	async create(conversation: ConversationModel): Promise<ConversationModel> {
		const created = await this.conversationModel.create(conversation)

		return ConversationMapper.fromEntitytoModel(created)
	}

	async getById(id: string): Promise<ConversationModel | null> {
		return this.conversationModel
			.findById(id)
			.then((conv: ConversationEntity | null) =>
				conv ? ConversationMapper.fromEntitytoModel(conv) : null,
			)
	}

	async addMessage(
		id: string,
		message: ConversationMessageModel,
	): Promise<IConversationMessage> {
		const conversation = await this.conversationModel.findOneAndUpdate(
			{
				_id: new mongoose.Types.ObjectId(id),
			},
			{
				$push: {
					messages: message,
				},
			},
			{
				new: true,
			},
		)

		return MessageMapper.fromEntitytoModel(
			conversation.messages.slice(-1)[0],
		)
	}

	async roomIdExists(roomId: string): Promise<boolean> {
		return this.conversationModel
			.findOne({ roomId })
			.then((conv: ConversationEntity) => !!conv)
	}
}
