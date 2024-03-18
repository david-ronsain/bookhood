/* eslint-disable @nx/enforce-module-boundaries */
import LibraryMapper from '../../../../src/app/application/mappers/library.mapper'
import LibraryModel from '../../../../src/app/domain/models/library.model'
import { LibraryEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/library.entity'
import {
	libraryEntity as lib,
	libraryModel,
} from '../../../../../shared-api/test'

describe('LibraryMapper', () => {
	it('should map LibraryEntity to LibraryModel', () => {
		// Mock data for testing
		const libraryEntity = lib as unknown as LibraryEntity

		const libraryModel = LibraryMapper.fromEntitytoModel(libraryEntity)

		expect(libraryModel._id).toBe(libraryEntity._id)
		expect(libraryModel.userId.toString()).toBe(libraryEntity.userId)
		expect(libraryModel.bookId.toString()).toBe(libraryEntity.bookId)
	})

	it('should convert LibraryModel object IDs to strings', () => {
		const libraryWithStringIds = LibraryMapper.modelObjectIdToString(
			libraryModel as unknown as LibraryModel,
		)

		expect(libraryWithStringIds._id).toBe(libraryModel._id.toString())
		expect(libraryWithStringIds.userId).toBe(libraryModel.userId.toString())
		expect(libraryWithStringIds.bookId).toBe(libraryModel.bookId.toString())
	})
})
