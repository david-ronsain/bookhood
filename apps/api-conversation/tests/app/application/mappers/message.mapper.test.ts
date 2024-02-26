/* eslint-disable @nx/enforce-module-boundaries */
import { IConversationMessage } from '../../../../../shared/src'
import MessageModel from '../../../../src/app/domain/models/message.model'
import MessageMapper from '../../../../src/app/application/mappers/message.mapper'
import { ConversationMessageEntity } from '../../../../src/app/infrastructure/adapters/repository/entities/message.entity'

describe('MessageMapper', () => {
	describe('Testing fromEntitytoModel method', () => {
		it('should return the entity', () => {
			const message: IConversationMessage = {
				_id: 'msgId',
				from: 'userId',
				message: 'message',
			}
			const model = new MessageModel(message)

			expect(
				MessageMapper.fromEntitytoModel(
					message as unknown as ConversationMessageEntity,
				),
			).toMatchObject(model)
		})
	})
})
