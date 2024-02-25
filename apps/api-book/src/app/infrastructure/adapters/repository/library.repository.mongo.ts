import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import mongoose, { Model } from 'mongoose'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { LibraryEntity } from './entities/library.entity'
import LibraryModel from '../../../domain/models/library.model'
import LibraryMapper from '../../../application/mappers/library.mapper'
import { IBooksList, ILibraryFull } from '@bookhood/shared'

@Injectable()
export default class LibraryRepositoryMongo implements LibraryRepository {
	constructor(
		@InjectModel('Library')
		private readonly libraryModel: Model<LibraryEntity>,
	) {}

	async getByUserIdAndBookId(
		userId: string,
		bookId: string,
	): Promise<LibraryModel> {
		const lib = await this.libraryModel.findOne({ userId, bookId })

		return lib ? LibraryMapper.fromEntitytoModel(lib) : null
	}

	async create(library: LibraryModel): Promise<LibraryModel> {
		const lib = await this.libraryModel.create(library)

		return LibraryMapper.fromEntitytoModel(lib)
	}

	async getByUser(userId: string, page: number): Promise<ILibraryFull[]> {
		return await this.libraryModel.aggregate([
			{
				$match: {
					userId: new mongoose.Types.ObjectId(userId),
				},
			},
			{
				$lookup: {
					from: 'books',
					localField: 'bookId',
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
					bookId: false,
					__v: false,
					createdAt: false,
					updatedAt: false,
					userId: false,
					'book.createdAt': false,
					'book.updatedAt': false,
					'book.__v': false,
				},
			},
			{
				$skip: page * 10,
			},
			{
				$limit: 10,
			},
		])
	}

	async getProfileBooks(userId: string, page: number): Promise<IBooksList> {
		return await this.libraryModel
			.aggregate([
				{
					$match: {
						userId: new mongoose.Types.ObjectId(userId),
					},
				},
				{
					$lookup: {
						from: 'books',
						localField: 'bookId',
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
						bookId: false,
						__v: false,
						createdAt: false,
						updatedAt: false,
						userId: false,
						'book.createdAt': false,
						'book.updatedAt': false,
						'book.__v': false,
						location: false,
					},
				},
				{
					$project: {
						status: true,
						_id: '$book._id',
						title: '$book.title',
						place: true,
						authors: '$book.authors',
						description: '$book.description',
					},
				},
				{
					$skip: page * 10,
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
			.then((results: IBooksList[]) =>
				results.length ? results[0] : { results: [], total: 0 },
			)
	}

	async getById(id: string): Promise<LibraryModel> {
		return this.libraryModel
			.findOne({ _id: new mongoose.Types.ObjectId(id) })
			.then((lib) => {
				if (!lib) {
					throw new Error()
				}
				return LibraryMapper.fromEntitytoModel(lib)
			})
			.catch(() => null)
	}

	async getFullById(libraryId: string): Promise<ILibraryFull | null> {
		return await this.libraryModel
			.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(libraryId),
					},
				},
				{
					$lookup: {
						from: 'books',
						localField: 'bookId',
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
			])
			.then((libs: ILibraryFull[]) => (libs.length ? libs[0] : null))
	}
}
