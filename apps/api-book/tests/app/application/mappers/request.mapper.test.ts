/* eslint-disable @nx/enforce-module-boundaries */
import RequestMapper from '../../../../src/app/application/mappers/request.mapper'
import { RequestEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/request.entity'
import RequestModel from '../../../../src/app/domain/models/request.model'
import { RequestStatus } from '../../../../../shared/src'
import mongoose from 'mongoose'
import {
	requestEntity as entity,
	requestModel,
} from '../../../../../shared-api/test'

describe('RequestMapper', () => {
	describe('fromEntitytoModel', () => {
		it('should correctly map entity to model', () => {
			const requestEntity = entity as unknown as RequestEntity

			const result = RequestMapper.fromEntitytoModel(requestEntity)

			expect(result).toBeInstanceOf(RequestModel)
			expect(result._id?.toString()).toBe(requestEntity._id)
			expect(result.libraryId.toString()).toBe(requestEntity.libraryId)
			expect(result.userId.toString()).toBe(requestEntity.userId)
			expect(result.ownerId.toString()).toBe(requestEntity.ownerId)
			expect(result.status).toBe(requestEntity.status)
			expect(result.events).toMatchObject(requestEntity.events)
		})
	})

	describe('modelObjectIdToString', () => {
		it('should correctly map model to IRequest', () => {
			const result = RequestMapper.modelObjectIdToString(requestModel)

			expect(result).toEqual({
				...requestModel,
				_id: requestModel._id?.toString(),
				libraryId: requestModel.libraryId.toString(),
				userId: requestModel.userId.toString(),
				ownerId: requestModel.ownerId.toString(),
			})
		})
	})
})
