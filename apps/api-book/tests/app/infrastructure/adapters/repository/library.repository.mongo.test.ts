/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import mongoose, { Model, Query } from 'mongoose'
import LibraryRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/library.repository.mongo'
import { LibraryEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/library.entity'
import LibraryModel from '../../../../../src/app/domain/models/library.model'
import { ILibraryFull, LibraryStatus } from '../../../../../../shared/src'
import LibraryMapper from '../../../../../src/app/application/mappers/library.mapper'

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
						aggregate: jest.fn(),
					},
				},
			],
		}).compile()

		libraryRepository = module.get<LibraryRepositoryMongo>(
			LibraryRepositoryMongo,
		)
		libraryModel = module.get<Model<LibraryEntity>>(
			getModelToken('Library'),
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
				findOneMock,
			)

			const result = await libraryRepository.getByUserIdAndBookId(
				mock.userId.toString(),
				mock.bookId.toString(),
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
					>,
			)

			const result = await libraryRepository.getByUserIdAndBookId(
				'userId',
				'bookId',
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
				createMock,
			)

			const library = new LibraryModel(mock)
			const result = await libraryRepository.create(library)

			expect(result).toBeInstanceOf(LibraryModel)
		})
	})

	describe('getByUser', () => {
		it('should return library list with pagination', async () => {
			const userId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const page = 1
			const expectedLibraries: ILibraryFull[] = [
				{
					_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
					book: {
						_id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
						title: 'Title',
						authors: ['author'],
						isbn: [
							{ type: 'ISBN_13', identifier: '0123456789123' },
						],
						description: 'desc',
						language: 'fr',
					},
					location: {
						type: 'Point',
						coordinates: [0, 0],
					},
				},
				{
					_id: 'cccccccccccccccccccccccc',
					book: {
						_id: 'dddddddddddddddddddddddd',
						title: 'Title',
						authors: ['author'],
						isbn: [
							{ type: 'ISBN_13', identifier: '1234567890123' },
						],
						description: 'desc',
						language: 'fr',
					},
					location: {
						type: 'Point',
						coordinates: [0, 0],
					},
				},
			]
			const libraryEntities: LibraryEntity[] =
				expectedLibraries as unknown as LibraryEntity[]

			jest.spyOn(libraryModel, 'aggregate').mockResolvedValueOnce(
				libraryEntities,
			)

			const result = await libraryRepository.getByUser(userId, page)

			expect(result).toEqual(expectedLibraries)
		})
	})

	describe('getById', () => {
		it('should return a library item by id', async () => {
			const id = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const libraryEntity = {
				_id: id,
				userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				bookId: 'cccccccccccccccccccccccc',
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
				status: LibraryStatus.TO_LEND,
				place: 'Some place',
			} as unknown as LibraryEntity

			jest.spyOn(libraryModel, 'findOne').mockResolvedValue(libraryEntity)

			const result = await libraryRepository.getById(id)

			expect(result).toMatchObject(
				LibraryMapper.fromEntitytoModel(libraryEntity),
			)
			expect(libraryModel.findOne).toHaveBeenCalledWith({
				_id: new mongoose.Types.ObjectId(id),
			})
		})

		it('should return null if no library item is found', async () => {
			const id = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			jest.spyOn(libraryModel, 'findOne').mockResolvedValue(null)

			const result = await libraryRepository.getById(id)

			expect(result).toBeNull()
			expect(libraryModel.findOne).toHaveBeenCalledWith({
				_id: new mongoose.Types.ObjectId(id),
			})
		})
	})

	describe('getFullById', () => {
		it('should return a library item with full details by id', async () => {
			const libraryId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const expectedResult: ILibraryFull = {
				book: {
					title: 'Title',
					authors: ['author'],
					description: 'desc',
					isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
					language: 'fr',
				},
				location: {
					type: 'Point',
					coordinates: [0, 0],
				},
			}

			jest.spyOn(libraryModel, 'aggregate').mockResolvedValue([
				expectedResult,
			])

			const result = await libraryRepository.getFullById(libraryId)

			expect(result).toEqual(expectedResult)
		})

		it('should return null if no library item is found', async () => {
			const libraryId = 'cccccccccccccccccccccccc'
			jest.spyOn(libraryModel, 'aggregate').mockResolvedValue([])

			const result = await libraryRepository.getFullById(libraryId)

			expect(result).toBeNull()
		})
	})
})
