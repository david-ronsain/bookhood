/* eslint-disable @nx/enforce-module-boundaries */
import PatchRequestUseCase from '../../../../../src/app/application/usecases/request/patchRequest.usecase'
import { RequestRepository } from '../../../../../src/app/domain/ports/request.repository'
import {
	IRequest,
	IRequestEvent,
	IRequestInfos,
	RequestStatus,
} from '../../../../../../shared/src'
import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
	CurrentUser,
	PatchRequestMQDTO,
} from '../../../../../../shared-api/src'
import RequestModel from '../../../../../src/app/domain/models/request.model'

describe('PatchRequestUseCase', () => {
	let patchRequestUseCase: PatchRequestUseCase
	let requestRepository: RequestRepository
	let mailClient: ClientProxy

	beforeEach(() => {
		requestRepository = {
			getById: jest.fn(),
			countActiveRequestsForUser: jest.fn(),
			patch: jest.fn(),
			getRequestInfos: jest.fn(),
		} as unknown as RequestRepository

		mailClient = {
			send: jest.fn(() => of({})),
		} as unknown as ClientProxy

		patchRequestUseCase = new PatchRequestUseCase(
			requestRepository,
			mailClient,
		)
	})

	describe('handler', () => {
		const request: IRequest = {
			_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
			libraryId: 'cccccccccccccccccccccccc',
			ownerId: 'dddddddddddddddddddddddd',
			status: RequestStatus.RETURN_PENDING,
			events: [] as IRequestEvent[],
		}

		const body: PatchRequestMQDTO = {
			status: RequestStatus.RETURNED_WITH_ISSUE,
			requestId: request._id ?? '',
			user: {
				_id: request.userId,
			} as unknown as CurrentUser,
			dates: ['2024-03-07', '2024-03-07'],
		}

		let foundRequest = new RequestModel(request)
		const infos: IRequestInfos = {
			_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			createdAt: new Date().toString(),
			emitter: {
				firstName: 'first1',
				lastName: 'last1',
				email: 'first1.last1@name.test',
			},
			owner: {
				firstName: 'first2',
				lastName: 'last2',
				email: 'first2.last2@name.test',
			},
			book: {
				title: 'Title',
			},
		}

		it('should patch the request status and return the updated request', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.PENDING_VALIDATION,
			}
			body.status = RequestStatus.ACCEPTED_PENDING_DELIVERY
			const newStatus = RequestStatus.ACCEPTED_PENDING_DELIVERY

			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(0)
			jest.spyOn(requestRepository, 'patch').mockResolvedValueOnce({
				...foundRequest,
				status: newStatus,
			})

			const result = await patchRequestUseCase.handler(body)

			expect(result).toEqual({ ...request, status: newStatus })
			expect(requestRepository.getById).toHaveBeenCalledWith(request._id)
			expect(
				requestRepository.countActiveRequestsForUser,
			).toHaveBeenCalledWith(
				request.userId,
				[expect.any(String), expect.any(String)],
				request._id,
			)
			expect(requestRepository.patch).toHaveBeenCalledWith(
				request._id,
				newStatus,
				expect.anything(),
				expect.any(String),
				expect.any(String),
			)
		})

		it('should throw NotFoundException when request is not found', async () => {
			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(null)

			await expect(patchRequestUseCase.handler(body)).rejects.toThrow(
				NotFoundException,
			)
			expect(requestRepository.getById).toHaveBeenCalledWith(request._id)
		})

		it('should throw ForbiddenException when user has an active request and tries to accept a new one', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.PENDING_VALIDATION,
			}
			body.status = RequestStatus.ACCEPTED_PENDING_DELIVERY

			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(1)

			await expect(patchRequestUseCase.handler(body)).rejects.toThrow(
				ForbiddenException,
			)
			expect(
				requestRepository.countActiveRequestsForUser,
			).toHaveBeenCalledWith(
				request.userId,
				[expect.any(String), expect.any(String)],
				request._id,
			)
		})

		it('should throw ForbiddenException when the transition is not allowed', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.RETURN_PENDING,
			}
			body.status = RequestStatus.PENDING_VALIDATION
			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)

			await expect(patchRequestUseCase.handler(body)).rejects.toThrow(
				ForbiddenException,
			)
		})

		it('should update the status to ACCEPTED_PENDING_DELIVERY and send the mail', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.PENDING_VALIDATION,
			}
			body.status = RequestStatus.ACCEPTED_PENDING_DELIVERY

			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(0)
			jest.spyOn(requestRepository, 'patch').mockResolvedValueOnce({
				...foundRequest,
				status: RequestStatus.PENDING_VALIDATION,
			})
			jest.spyOn(
				requestRepository,
				'getRequestInfos',
			).mockResolvedValueOnce(infos)

			await patchRequestUseCase.handler(body)

			expect(mailClient.send).toHaveBeenCalledWith(
				'mail-request-accepted',
				infos,
			)
		})

		it('should update the status to NEVER_RECEIVED and send the mail', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}
			body.status = RequestStatus.NEVER_RECEIVED
			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(0)
			jest.spyOn(requestRepository, 'patch').mockResolvedValueOnce({
				...foundRequest,
				status: RequestStatus.NEVER_RECEIVED,
			})
			jest.spyOn(
				requestRepository,
				'getRequestInfos',
			).mockResolvedValueOnce(infos)

			await patchRequestUseCase.handler(body)

			expect(mailClient.send).toHaveBeenCalledWith(
				'mail-request-never-received',
				infos,
			)
		})

		it('should update the status to REFUSED and send the mail', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.PENDING_VALIDATION,
			}
			body.status = RequestStatus.REFUSED
			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(0)
			jest.spyOn(requestRepository, 'patch').mockResolvedValueOnce({
				...foundRequest,
				status: RequestStatus.REFUSED,
			})
			jest.spyOn(
				requestRepository,
				'getRequestInfos',
			).mockResolvedValueOnce(infos)

			await patchRequestUseCase.handler(body)

			expect(mailClient.send).toHaveBeenCalledWith(
				'mail-request-refused',
				infos,
			)
		})

		it('should update the status to RETURNED_WITH_ISSUE and send the mail', async () => {
			foundRequest = {
				...foundRequest,
				status: RequestStatus.RETURN_PENDING,
			}
			body.status = RequestStatus.RETURNED_WITH_ISSUE

			jest.spyOn(requestRepository, 'getById').mockResolvedValueOnce(
				foundRequest,
			)
			jest.spyOn(
				requestRepository,
				'countActiveRequestsForUser',
			).mockResolvedValueOnce(0)
			jest.spyOn(requestRepository, 'patch').mockResolvedValueOnce({
				...foundRequest,
				status: RequestStatus.RETURNED_WITH_ISSUE,
			})
			jest.spyOn(
				requestRepository,
				'getRequestInfos',
			).mockResolvedValueOnce(infos)

			await patchRequestUseCase.handler(body)

			expect(mailClient.send).toHaveBeenCalledWith(
				'mail-request-returned-with-issue',
				infos,
			)
		})
	})

	describe('statusAllowed', () => {
		it('should return true if the status transition is allowed', () => {
			const currentStatus = RequestStatus.PENDING_VALIDATION
			const desiredStatus = RequestStatus.ACCEPTED_PENDING_DELIVERY

			const result = patchRequestUseCase.statusAllowed(
				currentStatus,
				desiredStatus,
			)

			expect(result).toBeTruthy()
		})

		it('should return false if the status transition is not allowed', () => {
			const currentStatus = RequestStatus.ACCEPTED_PENDING_DELIVERY
			const desiredStatus = RequestStatus.PENDING_VALIDATION

			const result = patchRequestUseCase.statusAllowed(
				currentStatus,
				desiredStatus,
			)

			expect(result).toBeFalsy()
		})
	})
})
