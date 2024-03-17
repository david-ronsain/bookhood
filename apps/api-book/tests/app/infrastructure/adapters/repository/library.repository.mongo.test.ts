/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import mongoose, { Model, Query } from 'mongoose'
import LibraryRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/library.repository.mongo'
import { LibraryEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/library.entity'
import LibraryModel from '../../../../../src/app/domain/models/library.model'
import { ILibraryFull, LibraryStatus } from '../../../../../../shared/src'
import LibraryMapper from '../../../../../src/app/application/mappers/library.mapper'
import {
	library,
	libraryFull,
	userLibraryStats,
	libraryEntity,
	booksList,
	librariesFull,
	libraryModel as libModel,
} from '../../../../../../shared-api/test'

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
						findOneAndUpdate: jest.fn(),
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
			const mock = libModel
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
				...libraryEntity,
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
			const expectedLibraries: ILibraryFull[] = librariesFull
			const libraryEntities: LibraryEntity[] =
				expectedLibraries as unknown as LibraryEntity[]

			jest.spyOn(libraryModel, 'aggregate').mockResolvedValueOnce(
				libraryEntities,
			)

			const result = await libraryRepository.getByUser(userId, page)

			expect(result).toEqual(expectedLibraries)
		})
	})

	describe('list', () => {
		it('should return books list with pagination', async () => {
			const userId = 'aaaaaaaaaaaaaaaaaaaaaaaa'
			const page = 1
			const expectedLibraries = booksList

			jest.spyOn(libraryModel, 'aggregate').mockResolvedValueOnce([
				expectedLibraries,
			])

			const result = await libraryRepository.list(userId, page)

			expect(result).toEqual(expectedLibraries)
		})
	})

	describe('getById', () => {
		const id = 'aaaaaaaaaaaaaaaaaaaaaaaa'

		it('should return a library item by id', async () => {
			const lib = {
				...libraryEntity,
				_id: id,
			} as unknown as LibraryEntity

			jest.spyOn(libraryModel, 'findOne').mockResolvedValue(lib)

			const result = await libraryRepository.getById(id)

			expect(result).toMatchObject(LibraryMapper.fromEntitytoModel(lib))
			expect(libraryModel.findOne).toHaveBeenCalledWith({
				_id: new mongoose.Types.ObjectId(id),
			})
		})

		it('should return null if no library item is found', async () => {
			jest.spyOn(libraryModel, 'findOne').mockResolvedValue(null)

			const result = await libraryRepository.getById(id)

			expect(result).toBeNull()
			expect(libraryModel.findOne).toHaveBeenCalledWith({
				_id: new mongoose.Types.ObjectId(id),
			})
		})
	})

	describe('getFullById', () => {
		const libraryId = 'aaaaaaaaaaaaaaaaaaaaaaaa'

		it('should return a library item with full details by id', async () => {
			const expectedResult = libraryFull

			jest.spyOn(libraryModel, 'aggregate').mockResolvedValue([
				expectedResult,
			])

			const result = await libraryRepository.getFullById(libraryId)

			expect(result).toEqual(expectedResult)
		})

		it('should return null if no library item is found', async () => {
			jest.spyOn(libraryModel, 'aggregate').mockResolvedValue([])

			const result = await libraryRepository.getFullById(libraryId)

			expect(result).toBeNull()
		})
	})

	describe('update', () => {
		it('should update the library', () => {
			const mockedValue = library
			jest.spyOn(libraryModel, 'findOneAndUpdate').mockImplementationOnce(
				() =>
					Promise.resolve(mockedValue) as unknown as Query<
						unknown,
						unknown,
						any,
						LibraryEntity,
						'findOneAndUpdate'
					>,
			)

			expect(
				libraryRepository.update('libraryId', LibraryStatus.TO_GIVE),
			).resolves.toBe(mockedValue)
		})

		it('should not update the library', () => {
			jest.spyOn(libraryModel, 'findOneAndUpdate').mockImplementationOnce(
				() =>
					Promise.resolve(null) as unknown as Query<
						unknown,
						unknown,
						any,
						LibraryEntity,
						'findOneAndUpdate'
					>,
			)

			expect(
				libraryRepository.update('libraryId', LibraryStatus.TO_GIVE),
			).resolves.toBeNull()
		})
	})

	describe('getStats', () => {
		const userId = 'aaaaaaaaaaaaaaaaaaaaaaaa'

		it("should return the user's stats", () => {
			const stats = userLibraryStats
			jest.spyOn(libraryModel, 'aggregate').mockResolvedValue([stats])

			expect(libraryRepository.getStats(userId)).resolves.toMatchObject(
				stats,
			)
		})

		it('should return null if no data is found', async () => {
			jest.spyOn(libraryModel, 'aggregate').mockResolvedValue([])

			const result = await libraryRepository.getStats(userId)

			expect(result).toBeNull()
		})
	})
})
