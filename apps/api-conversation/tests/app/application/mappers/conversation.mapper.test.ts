/* eslint-disable @nx/enforce-module-boundaries */
import ConversationModel from '../../../../src/app/domain/models/conversation.model'
import ConversationMapper from '../../../../src/app/application/mappers/conversation.mapper'
import { ConversationEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/conversation.entity'
import { conversation } from '../../../../../shared-api/test'

describe('ConversationMapper', () => {
	describe('Testing fromEntitytoModel method', () => {
		it('should return the entity', () => {
			const model = new ConversationModel(conversation)

			expect(
				ConversationMapper.fromEntitytoModel(
					conversation as unknown as ConversationEntity,
				),
			).toMatchObject(model)
		})
	})
})
