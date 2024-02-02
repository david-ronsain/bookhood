import { NestFactory } from '@nestjs/core'

import { UserModule } from './app/user.module'
import { Transport, RmqOptions } from '@nestjs/microservices'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import envConfig from './config/env.config'

async function bootstrap() {
	const app = await NestFactory.createMicroservice(UserModule, {
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
			queue: envConfig().rabbitmq.queues.user || '',
			queueOptions: {
				durable: true,
			},
			noAck: true,
		},
	} as RmqOptions)

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

	await app.listen()
}

bootstrap()
