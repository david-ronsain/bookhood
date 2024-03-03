/* eslint-disable @nx/enforce-module-boundaries */
import { Model, UpdateWriteOpResult } from 'mongoose'
import ConversationRepositoryMongo from '../../../../../src/app/infrastructure/adapters/repository/conversation.repository.mongo'
import { ConversationEntity } from '../../../../../src/app/infrastructure/adapters/repository/entities/conversation.entity'
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import {
	IConversation,
	IConversationFull,
	IConversationMessage,
} from '../../../../../../shared/src'

describe('BookRepositoryMongo', () => {
	let conversationRepository: ConversationRepositoryMongo
	let conversationModel: Model<ConversationEntity>

	const conversationFull: IConversationFull = {
		_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
		messages: [],
		roomId: 'roomId',
		request: {
			_id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
			book: {
				title: 'title',
			},
			createdAt: '',
			emitter: {
				_id: 'id#1',
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@email.test',
			},
			owner: {
				_id: 'id#2',
				firstName: 'first1',
				lastName: 'last1',
				email: 'first1.last1@email.test',
			},
		},
	}
	const conversation: IConversation = {
		_id: conversationFull._id,
		messages: conversationFull.messages,
		requestId: conversationFull.request._id,
		roomId: conversationFull.roomId,
		users: [
			conversationFull.request.emitter._id || '',
			conversationFull.request.owner._id || '',
		],
	}
	const message: IConversationMessage = {
		message: 'message',
		from: conversation.users[0],
		seenBy: [],
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConversationRepositoryMongo,
				{
					provide: getModelToken('Conversation'),
					useValue: {
						aggregate: jest.fn(),
						create: jest.fn(),
						findById: jest.fn(),
						findOneAndUpdate: jest.fn(),
						findOne: jest.fn(),
						updateOne: jest.fn(),
					},
				},
			],
		}).compile()

		conversationRepository = module.get<ConversationRepositoryMongo>(
			ConversationRepositoryMongo,
		)
		conversationModel = module.get<Model<ConversationEntity>>(
			getModelToken('Conversation'),
		)
	})

	describe('Testing getByRequestId method', () => {
		it('should return null if the conversation does not exist', () => {
			jest.spyOn(conversationModel, 'aggregate').mockImplementationOnce(
				jest.fn().mockResolvedValue([]),
			)
			expect(
				conversationRepository.getByRequestId(
					'aaaaaaaaaaaaaaaaaaaaaaaa',
				),
			).resolves.toBeNull()
		})

		it('should return the conversation by its id', () => {
			jest.spyOn(conversationModel, 'aggregate').mockImplementationOnce(
				jest.fn().mockResolvedValue([conversationFull]),
			)
			expect(
				conversationRepository.getByRequestId(conversationFull._id),
			).resolves.toMatchObject(conversationFull)
		})

		it('should return the conversation by its request id', () => {
			jest.spyOn(conversationModel, 'aggregate').mockImplementationOnce(
				jest.fn().mockResolvedValue([conversationFull]),
			)
			expect(
				conversationRepository.getByRequestId(
					undefined,
					conversationFull.request._id,
				),
			).resolves.toMatchObject(conversationFull)
		})
	})

	describe('Testing create method', () => {
		it('should create the conversation', () => {
			jest.spyOn(conversationModel, 'create').mockImplementationOnce(
				jest.fn().mockReturnValue(conversation as ConversationEntity),
			)

			expect(
				conversationRepository.create(conversation),
			).resolves.toMatchObject(conversation)
		})
	})

	describe('Testing the getById method', () => {
		it('should return null if the conversation does not exist', () => {
			jest.spyOn(conversationModel, 'findById').mockResolvedValueOnce(
				null,
			)

			expect(
				conversationRepository.getById('aaaaaaaaaaaaaaaaaaaaaaaa'),
			).resolves.toBeNull()
		})

		it('should return the conversation', () => {
			jest.spyOn(conversationModel, 'findById').mockResolvedValueOnce(
				conversation,
			)

			expect(
				conversationRepository.getById('aaaaaaaaaaaaaaaaaaaaaaaa'),
			).resolves.toMatchObject(conversation)
		})
	})

	describe('Testing the addMessage method', () => {
		it('should update the conversation', () => {
			const conv = { ...conversation, messages: [message] }
			jest.spyOn(
				conversationModel,
				'findOneAndUpdate',
			).mockResolvedValueOnce(conv)

			expect(
				conversationRepository.addMessage(conv._id || '', message),
			).resolves.toMatchObject(message)
		})
	})

	describe('Testing the roomIdExists method', () => {
		it('should return true', () => {
			jest.spyOn(conversationModel, 'findOne').mockResolvedValueOnce(true)

			expect(
				conversationRepository.roomIdExists('aaaaaaaaaaaaaaaaaaaaaaaa'),
			).resolves.toBe(true)
		})

		it('should return false', () => {
			jest.spyOn(conversationModel, 'findOne').mockResolvedValueOnce(
				false,
			)

			expect(
				conversationRepository.roomIdExists('aaaaaaaaaaaaaaaaaaaaaaaa'),
			).resolves.toBe(false)
		})
	})

	describe('Testing the getMessageById method', () => {
		it('should return null if the message does not exist', () => {
			jest.spyOn(conversationModel, 'aggregate').mockResolvedValueOnce([])

			expect(
				conversationRepository.getMessageById(
					'aaaaaaaaaaaaaaaaaaaaaaaa',
					'aaaaaaaaaaaaaaaaaaaaaaaa',
				),
			).resolves.toBeNull()
		})

		it('should return the message', () => {
			jest.spyOn(conversationModel, 'aggregate').mockResolvedValueOnce([
				message,
			])

			expect(
				conversationRepository.getMessageById(
					'aaaaaaaaaaaaaaaaaaaaaaaa',
					'aaaaaaaaaaaaaaaaaaaaaaaa',
				),
			).resolves.toMatchObject(message)
		})
	})

	describe('Testing the flagAsSeen method', () => {
		it('should flag the message as seen', () => {
			jest.spyOn(conversationModel, 'updateOne').mockResolvedValueOnce({
				modifiedCount: 1,
			} as UpdateWriteOpResult)

			expect(
				conversationRepository.flagAsSeen(
					'aaaaaaaaaaaaaaaaaaaaaaaa',
					'aaaaaaaaaaaaaaaaaaaaaaaa',
					'aaaaaaaaaaaaaaaaaaaaaaaa',
				),
			).resolves.toBe(true)
		})
	})
})
