import envConfig from '../../src/config/env.config'
import { ConfigModule } from '@nestjs/config'

describe('Testing the env configuration', () => {
	it('should have a defined configuration', () => {
		ConfigModule.forRoot({ envFilePath: '../../../../.env.test' })

		expect(envConfig().gateway.mail.serviceName).toBe(
			process.env.APP_API_MAIL_SERVICE_NAME || ''
		)

		expect(envConfig().rabbitmq.host).toBe(process.env.RMQ_HOST || '')
		expect(envConfig().rabbitmq.port).toBe(
			parseInt(process.env.RMQ_PORT || '')
		)
		expect(envConfig().rabbitmq.protocol).toBe(
			(process.env.RMQ_PROTOCOL || '') as 'amqp'
		)
		expect(envConfig().rabbitmq.user).toBe(process.env.RMQ_USER || '')
		expect(envConfig().rabbitmq.password).toBe(
			process.env.RMQ_PASSWORD || ''
		)
		expect(envConfig().rabbitmq.vhost).toBe(process.env.RMQ_VHOST || '')
		expect(envConfig().rabbitmq.queues.mail).toBe(
			process.env.RMQ_MAIL_QUEUE || ''
		)
	})
})
