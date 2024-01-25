import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserController } from './application/controllers/user.controller'
import envConfig from '../config/env.config'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import { RolesGuard } from './application/guards/role.guard'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import {
	CacheInterceptor,
	CacheModule,
	CacheModuleOptions,
} from '@nestjs/cache-manager'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [envConfig],
		}),
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () =>
				({
					url: `${envConfig().redis.protocol}://${
						envConfig().redis.user
					}${envConfig().redis.host}:${envConfig().redis.port}`,
					ttl: envConfig().redis.ttl,
				} as CacheModuleOptions),
		}),
		WinstonModule.forRoot(
			winstonConfig(winston, envConfig().gateway.gateway.serviceName)
		),
	],
	controllers: [UserController],
	providers: [
		ConfigService,
		{
			provide: 'RabbitGateway',
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
						queue: envConfig().rabbitmq.queues.gateway || '',
						queueOptions: {
							durable: true,
						},
					},
				} as RmqOptions)
			},
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
})
export class AppModule {}
