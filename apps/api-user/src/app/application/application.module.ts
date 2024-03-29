import { Module } from '@nestjs/common'
import { USER_USECASES } from './usecases'
import { UserController } from './controllers/user.controller'
import { DomainModule } from '../domain/domain.module'
import UserRepositoryMongo from '../infrastructure/adapters/repository/user.repository.mongo'
import UserSchema from '../infrastructure/adapters/repository/schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import envConfig from '../../config/env.config'
import { AuthController } from './controllers/auth.controller'

@Module({
	imports: [
		DomainModule,
		MongooseModule.forFeature([
			{
				name: 'User',
				schema: UserSchema,
			},
		]),
	],
	controllers: [UserController, AuthController],
	providers: [
		...USER_USECASES,
		{
			provide: 'UserRepository',
			useClass: UserRepositoryMongo,
		},
		{
			provide: 'RabbitMail',
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
						queue: envConfig().rabbitmq.queues.mail || '',
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
	],
	exports: [...USER_USECASES],
})
export class ApplicationModule {}
