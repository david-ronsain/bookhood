import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserController } from './application/controllers/user.controller'
import envConfig from '../config/env.config'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'
import { AuthController } from './application/controllers/auth.controller'
import { BookController } from './application/controllers/book.controller'
import { RequestController } from './application/controllers/request.controller'
import { ConversationGateway } from './application/sockets/conversation.socket'
import { LibraryController } from './application/controllers/library.controller'
import { HeaderResolver, I18nModule } from 'nestjs-i18n'
import { MQResolver } from '@bookhood/shared-api'
import path from 'path'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [envConfig],
		}),
		/*CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () =>
				({
					url: `${envConfig().redis.protocol}://${
						envConfig().redis.user
					}${envConfig().redis.host}:${envConfig().redis.port}`,
					ttl: envConfig().redis.ttl,
				}) as CacheModuleOptions,
		}),*/
		WinstonModule.forRoot(
			winstonConfig(winston, envConfig().gateway.gateway.serviceName),
		),
		I18nModule.forRoot({
			fallbackLanguage: envConfig().i18n.fallbackLocale,
			resolvers: [
				{
					use: HeaderResolver,
					options: [envConfig().i18n.localeToken],
				},
			],
			loaderOptions: {
				path: path.join(__dirname, '/app/application/locales/'),
				watch: true,
			},
		}),
	],
	controllers: [
		UserController,
		AuthController,
		BookController,
		RequestController,
		LibraryController,
	],
	providers: [
		ConversationGateway,
		ConfigService,
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
						queue: envConfig().rabbitmq.queues.user,
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
						queue: envConfig().rabbitmq.queues.book,
						queueOptions: {
							durable: true,
						},
					},
				} as RmqOptions)
			},
		},
		{
			provide: 'RabbitConversation',
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
						queue: envConfig().rabbitmq.queues.conversation,
						queueOptions: {
							durable: true,
						},
					},
				} as RmqOptions)
			},
		},
		/*{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},*/
	],
})
export class AppModule {}
