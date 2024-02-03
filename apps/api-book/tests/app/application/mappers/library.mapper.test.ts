import mongoose from 'mongoose'
import LibraryMapper from '../../../../src/app/application/mappers/library.mapper'
import LibraryModel from '../../../../src/app/domain/models/library.model'
import { LibraryEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/library.entity'

describe('LibraryMapper', () => {
	it('should map LibraryEntity to LibraryModel', () => {
		// Mock data for testing
		const libraryEntity = {
			_id: '123',
			userId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			bookId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
		} as unknown as LibraryEntity

		const libraryModel = LibraryMapper.fromEntitytoModel(libraryEntity)

		expect(libraryModel._id).toBe(libraryEntity._id)
		expect(libraryModel.userId.toString()).toBe(libraryEntity.userId)
		expect(libraryModel.bookId.toString()).toBe(libraryEntity.bookId)
	})

	it('should convert LibraryModel object IDs to strings', () => {
		const libraryModel: LibraryModel = {
			_id: '123',
			userId: new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
			bookId: new mongoose.Types.ObjectId('bbbbbbbbbbbbbbbbbbbbbbbb'),
			location: { type: 'Point', coordinates: [0, 0] },
		}

		const libraryWithStringIds =
			LibraryMapper.modelObjectIdToString(libraryModel)

		expect(libraryWithStringIds._id).toBe('123')
		expect(libraryWithStringIds.userId).toBe('aaaaaaaaaaaaaaaaaaaaaaaa')
		expect(libraryWithStringIds.bookId).toBe('bbbbbbbbbbbbbbbbbbbbbbbb')
	})
})
