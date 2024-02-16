/* eslint-disable @nx/enforce-module-boundaries */
import RequestMapper from '../../../../src/app/application/mappers/request.mapper'
import { RequestEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/request.entity'
import { IRequest } from '@bookhood/shared'
import RequestModel from '../../../../src/app/domain/models/request.model'
import { RequestStatus } from '../../../../../shared/src'
import mongoose from 'mongoose'

describe('RequestMapper', () => {
	describe('fromEntitytoModel', () => {
		it('should correctly map entity to model', () => {
			const requestEntity = {
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				libraryId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
				userId: 'cccccccccccccccccccccccc',
				ownerId: 'dddddddddddddddddddddddd',
				status: RequestStatus.REFUSED,
				dueDate: new Date().toString(),
				events: [
					{
						oldStatus: RequestStatus.ACCEPTED_PENDING_DELIVERY,
						currentStatus: RequestStatus.REFUSED,
						date: new Date().toString(),
						userId: 'owner_id',
					},
				],
			} as unknown as RequestEntity

			const result = RequestMapper.fromEntitytoModel(requestEntity)

			expect(result).toBeInstanceOf(RequestModel)
			expect(result._id?.toString()).toBe(requestEntity._id)
			expect(result.libraryId.toString()).toBe(requestEntity.libraryId)
			expect(result.userId.toString()).toBe(requestEntity.userId)
			expect(result.ownerId.toString()).toBe(requestEntity.ownerId)
			expect(result.status).toBe(RequestStatus.REFUSED)
			expect(result.events).toMatchObject(requestEntity.events)
		})
	})

	describe('modelObjectIdToString', () => {
		it('should correctly map model to IRequest', () => {
			const requestModel: RequestModel = {
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				libraryId: new mongoose.Types.ObjectId(
					'bbbbbbbbbbbbbbbbbbbbbbbb',
				),
				userId: new mongoose.Types.ObjectId('cccccccccccccccccccccccc'),
				ownerId: new mongoose.Types.ObjectId(
					'dddddddddddddddddddddddd',
				),
				status: RequestStatus.REFUSED,
				events: [],
			}

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
