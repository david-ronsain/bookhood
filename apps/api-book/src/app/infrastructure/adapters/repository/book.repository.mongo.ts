import BookModel from '../../../domain/models/book.model'
import { BookRepository } from '../../../domain/ports/book.repository'
import { InjectModel } from '@nestjs/mongoose'
import { BookEntity } from './entities/book.entity'
import { Injectable } from '@nestjs/common'
import BookMapper from '../../../application/mappers/book.mapper'
import { Model, PipelineStage } from 'mongoose'
import { IBookSearch } from '@bookhood/shared'

@Injectable()
export default class BookRepositoryMongo implements BookRepository {
	constructor(
		@InjectModel('Book') private readonly bookModel: Model<BookEntity>,
	) {}
	async getByISBN(isbn: string[]): Promise<BookModel | null> {
		const book = await this.bookModel.findOne({
			'isbn.identifier': { $in: isbn },
		})

		return book ? BookMapper.fromEntitytoModel(book) : null
	}

	async create(book: BookModel): Promise<BookModel> {
		const created = await this.bookModel.create(book)

		return BookMapper.fromEntitytoModel(created)
	}

	async search(
		category: string,
		term: string,
		startAt: number,
		language: string,
		boundingBox: number[],
		email?: string,
	): Promise<IBookSearch> {
		const stages: PipelineStage[] = []

		term = term.replace(/ /, '.*')
		const filters: object = {
			language,
		}
		if (category === 'inauthor' && term.length) {
			filters['authors'] = {
				$regex: new RegExp(term, 'ig'),
			}
		} else if (category === 'intitle' && term.length) {
			filters['title'] = {
				$regex: new RegExp(term, 'ig'),
			}
		}

		stages.push(
			{
				$match: filters,
			},
			{
				$lookup: {
					from: 'libraries',
					localField: '_id',
					foreignField: 'bookId',
					as: 'owner',
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'owner.userId',
					foreignField: '_id',
					as: 'user',
				},
			},
		)

		if (boundingBox && boundingBox.length === 4) {
			stages.push({
				$match: {
					owner: {
						$elemMatch: {
							location: {
								$geoWithin: {
									$box: [
										[boundingBox[0], boundingBox[1]],
										[boundingBox[2], boundingBox[3]],
									],
								},
							},
						},
					},
				},
			})
		}

		stages.push(
			{
				$addFields: {
					'owner.coords': {
						lng: {
							$first: { $first: '$owner.location.coordinates' },
						},
						lat: {
							$last: { $last: '$owner.location.coordinates' },
						},
					},
				},
			},
			{
				$set: {
					owner: {
						$map: {
							input: '$owner',
							in: {
								$mergeObjects: [
									'$$this',
									{
										user: {
											$arrayElemAt: [
												'$user',
												{
													$indexOfArray: [
														'$user._id',
														'$$this.userId',
													],
												},
											],
										},
									},
								],
							},
						},
					},
				},
			},
		)

		if (email && email.length) {
			stages.push({
				$match: {
					'owner.user.email': { $ne: email },
				},
			})
		}

		stages.push(
			{
				$project: {
					user: false,
					createdAt: false,
					updatedAt: false,
					__v: false,
					'owner.__v': false,
					'owner.bookId': false,
					'owner.userId': false,
					'owner.createdAt': false,
					'owner.updatedAt': false,
					'owner.user.role': false,
					'owner.user.token': false,
					'owner.user.tokenExpiration': false,
					'owner.user.createdAt': false,
					'owner.user.updatedAt': false,
				},
			},
			{
				$sort: {
					title: 1,
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
		)

		const list: IBookSearch[] = await this.bookModel.aggregate(stages)

		return list.length ? list[0] : { results: [], total: 0 }
	}
}
