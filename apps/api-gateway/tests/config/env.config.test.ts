import envConfig from '../../src/config/env.config'
import { ConfigModule } from '@nestjs/config'

describe('Testing the env configuration', () => {
	it('should have a defined configuration', () => {
		ConfigModule.forRoot({ envFilePath: '../../../../.env.test' })
		expect(envConfig().settings.apiPrefix).toBe(
			process.env.APP_API_GATEWAY_PREFIX || ''
		)
		expect(envConfig().settings.host).toBe(
			process.env.APP_API_GATEWAY_HOST || ''
		)
		expect(envConfig().settings.port).toBe(
			parseInt(process.env.APP_API_GATEWAY_PORT || '')
		)
		expect(envConfig().settings.docPrefix).toBe(
			process.env.APP_API_GATEWAY_DOC || ''
		)
		expect(envConfig().settings.protocol).toBe(
			(process.env.APP_API_GATEWAY_PROTOCOL || '') as 'http' | 'https'
		)

		expect(envConfig().gateway.user.host).toBe(
			process.env.APP_API_USER_HOST || ''
		)
		expect(envConfig().gateway.user.port).toBe(
			parseInt(process.env.APP_API_USER_PORT || '')
		)
		expect(envConfig().gateway.user.token).toBe(
			process.env.APP_API_GATEWAY_USER_TOKEN || ''
		)
		expect(envConfig().gateway.user.serviceName).toBe(
			process.env.APP_API_USER_SERVICE_NAME || ''
		)
		expect(envConfig().gateway.gateway.serviceName).toBe(
			process.env.APP_API_GATEWAY_SERVICE_NAME || ''
		)

		expect(envConfig().redis.host).toBe(process.env.REDIS_HOST || '')
		expect(envConfig().redis.port).toBe(
			parseInt(process.env.REDIS_PORT || '')
		)
		expect(envConfig().redis.ttl).toBe(
			parseInt(process.env.REDIS_TTL || '')
		)
		expect(envConfig().redis.user).toBe(process.env.REDIS_USER || '')
		expect(envConfig().redis.protocol).toBe(
			(process.env.REDIS_PASSWORD || 'redis') as 'redis'
		)

		expect(envConfig().mongo.database).toBe(
			process.env.MONGO_DATABASE || ''
		)
		expect(envConfig().mongo.host).toBe(process.env.MONGO_HOST || '')
		expect(envConfig().mongo.port).toBe(
			parseInt(process.env.MONGO_PORT || '')
		)
		expect(envConfig().mongo.protocol).toBe(
			process.env.MONGO_PROTOCOL || ''
		)
		expect(envConfig().mongo.user).toBe(process.env.MONGO_USER || '')

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
		expect(envConfig().rabbitmq.queues.gateway).toBe(
			process.env.RMQ_GATEWAY_QUEUE || ''
		)
	})
})
