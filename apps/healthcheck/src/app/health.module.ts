import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HttpModule } from '@nestjs/axios'
import { HealthController } from './health.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import envConfig from '../config/env.config'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'

const getRabbitMQConfig = (service: string): RmqOptions =>
	({
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
			queue: envConfig().rabbitmq.queues[service] || '',
			queueOptions: {
				durable: true,
			},
		},
	} as RmqOptions)

@Module({
	imports: [
		TerminusModule,
		HttpModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: () => ({
				uri: `${envConfig().mongo.protocol}://${
					envConfig().mongo.user
				}${
					envConfig().mongo.host
				}:${envConfig().mongo.port.toString()}/${
					envConfig().mongo.database
				}`,
			}),
		}),
		WinstonModule.forRoot(winstonConfig(winston, 'healthcheck')),
	],
	controllers: [HealthController],
	providers: [
		ConfigService,
		{
			provide: `RabbitMQGateway`,
			useFactory: () => {
				return ClientProxyFactory.create(getRabbitMQConfig('gateway'))
			},
		},
		{
			provide: `RabbitMQMail`,
			useFactory: () => {
				return ClientProxyFactory.create(getRabbitMQConfig('mail'))
			},
		},
	],
})
export class HealthModule {}
