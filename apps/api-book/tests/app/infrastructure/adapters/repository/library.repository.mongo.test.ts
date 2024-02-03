import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import mongoose, { Model, Query } from 'mongoose'
import LibraryRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/library.repository.mongo'
import { LibraryEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/library.entity'
import LibraryModel from '../../../../../src/app/domain/models/library.model'

describe('LibraryRepositoryMongo', () => {
	let libraryRepository: LibraryRepositoryMongo
	let libraryModel: Model<LibraryEntity>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				LibraryRepositoryMongo,
				{
					provide: getModelToken('Library'),
					useValue: {
						findOne: jest.fn(),
						create: jest.fn(),
					},
				},
			],
		}).compile()

		libraryRepository = module.get<LibraryRepositoryMongo>(
			LibraryRepositoryMongo
		)
		libraryModel = module.get<Model<LibraryEntity>>(
			getModelToken('Library')
		)
	})

	describe('getByUserIdAndBookId', () => {
		it('should return a LibraryModel if library is found', async () => {
			const mock = {
				_id: new mongoose.Types.ObjectId(),
				userId: new mongoose.Types.ObjectId(),
				bookId: new mongoose.Types.ObjectId(),
				location: { type: 'Point', coordinates: [0, 0] },
			}
			const findOneMock = jest.fn().mockReturnValue(mock)
			jest.spyOn(libraryModel, 'findOne').mockImplementationOnce(
				findOneMock
			)

			const result = await libraryRepository.getByUserIdAndBookId(
				mock.userId.toString(),
				mock.bookId.toString()
			)

			expect(result).toBeInstanceOf(LibraryModel)
		})

		it('should return null if library is not found', async () => {
			jest.spyOn(libraryModel, 'findOne').mockImplementationOnce(
				() =>
					null as unknown as Query<
						unknown,
						unknown,
						object,
						LibraryEntity,
						'findOne'
					>
			)

			const result = await libraryRepository.getByUserIdAndBookId(
				'userId',
				'bookId'
			)

			expect(result).toBeNull()
		})
	})

	describe('create', () => {
		it('should return a created LibraryModel', async () => {
			const mock = {
				_id: '123',
				userId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				bookId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
			} as LibraryEntity
			const createMock = jest.fn().mockReturnValue(mock)
			jest.spyOn(libraryModel, 'create').mockImplementationOnce(
				createMock
			)

			const library = new LibraryModel(mock)
			const result = await libraryRepository.create(library)

			expect(result).toBeInstanceOf(LibraryModel)
		})
	})
})
