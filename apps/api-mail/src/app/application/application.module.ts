import { Module } from '@nestjs/common'
import { USECASES } from './usecases'
import { MailController } from './controllers/mail.controller'
import { SESManagerService } from '../infrastructure/adapters/aws/ses/awsses.service'
import { SESManagerModule } from '../infrastructure/adapters/aws/ses/awsses.module'
import {
	ClientProxyFactory,
	RmqOptions,
	Transport,
} from '@nestjs/microservices'
import envConfig from '../../config/env.config'

@Module({
	imports: [SESManagerModule],
	controllers: [MailController],
	providers: [
		...USECASES,
		{
			provide: 'Mailer',
			useClass: SESManagerService,
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
	exports: [...USECASES],
})
export class ApplicationModule {}
