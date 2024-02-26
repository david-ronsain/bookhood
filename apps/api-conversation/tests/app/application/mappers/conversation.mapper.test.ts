/* eslint-disable @nx/enforce-module-boundaries */
import { IConversation } from '../../../../../shared/src'
import ConversationModel from '../../../../src/app/domain/models/conversation.model'
import ConversationMapper from '../../../../src/app/application/mappers/conversation.mapper'
import { ConversationEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/conversation.entity'

describe('ConversationMapper', () => {
	describe('Testing fromEntitytoModel method', () => {
		it('should return the entity', () => {
			const conversation: IConversation = {
				_id: 'convId',
				messages: [],
				requestId: 'requestId',
				roomId: 'roomId',
				users: ['userId1', 'userId2'],
			}
			const model = new ConversationModel(conversation)

			expect(
				ConversationMapper.fromEntitytoModel(
					conversation as unknown as ConversationEntity,
				),
			).toMatchObject(model)
		})
	})
})
