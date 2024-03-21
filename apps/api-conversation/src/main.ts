import { NestFactory } from '@nestjs/core'

import { ConversationModule } from './app/conversation.module'
import { Transport, RmqOptions } from '@nestjs/microservices'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import envConfig from './config/env.config'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	const app = await NestFactory.createMicroservice(ConversationModule, {
		transport: Transport.RMQ,
		options: {
			urls: [
				`${envConfig().rabbitmq.protocol}://${
					envConfig().rabbitmq.user
				}:${envConfig().rabbitmq.password}@${
					envConfig().rabbitmq.host
				}:${envConfig().rabbitmq.port.toString()}/${
					envConfig().rabbitmq.vhost
				}`,
			],
			queue: envConfig().rabbitmq.queues.conversation,
			queueOptions: {
				durable: true,
			},
		},
	} as RmqOptions)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			forbidUnknownValues: true,
			stopAtFirstError: true,
		}),
	)

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

	await app.listen()
}

bootstrap()
