import { InjectModel } from '@nestjs/mongoose'
import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { LibraryRepository } from '../../../domain/ports/library.repository'
import { LibraryEntity } from './entities/library.entity'
import LibraryModel from '../../../domain/models/library.model'
import LibraryMapper from '../../../application/mappers/library.mapper'

@Injectable()
export default class LibraryRepositoryMongo implements LibraryRepository {
	constructor(
		@InjectModel('Library')
		private readonly libraryModel: Model<LibraryEntity>
	) {}

	async getByUserIdAndBookId(
		userId: string,
		bookId: string
	): Promise<LibraryModel> {
		const lib = await this.libraryModel.findOne({ userId, bookId })

		return lib ? LibraryMapper.fromEntitytoModel(lib) : null
	}

	async create(library: LibraryModel): Promise<LibraryModel> {
		const lib = await this.libraryModel.create(library)

		return lib ? LibraryMapper.fromEntitytoModel(lib) : null
	}
}
