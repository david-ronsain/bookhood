import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import mongoose, { Model } from 'mongoose'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { LibraryEntity } from './entities/library.entity'
import LibraryModel from '../../../domain/models/library.model'
import LibraryMapper from '../../../application/mappers/library.mapper'
import { ILibraryFull } from '@bookhood/shared'

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
				$skip: page * 12,
			},
			{
				$limit: 12,
			},
		])
	}

	async getById(id: string): Promise<LibraryModel> {
		return this.libraryModel
			.findOne({ _id: new mongoose.Types.ObjectId(id) })
			.then((lib) => LibraryMapper.fromEntitytoModel(lib))
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
