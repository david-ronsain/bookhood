import { Module } from '@nestjs/common'
import { CONVERSATION_USECASES } from './usecases'
import { ConversationController } from './controllers/conversation.controller'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import envConfig from '../../config/env.config'
import ConversationRepositoryMongo from '../infrastructure/adapters/repository/conversation.repository.mongo'
import { MongooseModule } from '@nestjs/mongoose'
import ConversationSchema from '../infrastructure/adapters/repository/schemas/conversation.schema'
import { DomainModule } from '../domain/domain.module'

@Module({
	imports: [
		DomainModule,
		MongooseModule.forFeature([
			{
				name: 'Conversation',
				schema: ConversationSchema,
			},
		]),
	],
	controllers: [ConversationController],
	providers: [
		...CONVERSATION_USECASES,
		{
			provide: 'ConversationRepository',
			useClass: ConversationRepositoryMongo,
		},
		{
			provide: 'RabbitUser',
			useFactory: () => {
				return ClientProxyFactory.create({
					transport: Transport.RMQ,
					options: {
						urls: [
							`${envConfig().rabbitmq.protocol || ''}://${
								envConfig().rabbitmq.user || ''
							}:${envConfig().rabbitmq.password || ''}@${
								envConfig().rabbitmq.host || ''
							}:${envConfig().rabbitmq.port || ''}/${
								envConfig().rabbitmq.vhost || ''
							}`,
						],
						queue: envConfig().rabbitmq.queues.user || '',
						queueOptions: {
							durable: true,
						},
					},
				} as RmqOptions)
			},
		},
		{
			provide: 'RabbitBook',
			useFactory: () => {
				return ClientProxyFactory.create({
					transport: Transport.RMQ,
					options: {
						urls: [
							`${envConfig().rabbitmq.protocol || ''}://${
								envConfig().rabbitmq.user || ''
							}:${envConfig().rabbitmq.password || ''}@${
								envConfig().rabbitmq.host || ''
							}:${envConfig().rabbitmq.port || ''}/${
								envConfig().rabbitmq.vhost || ''
							}`,
						],
						queue: envConfig().rabbitmq.queues.book || '',
						queueOptions: {
							durable: true,
						},
					},
				} as RmqOptions)
			},
		},
	],
	exports: [...CONVERSATION_USECASES],
})
export class ApplicationModule {}
