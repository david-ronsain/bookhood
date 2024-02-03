import envConfig from '../../src/config/env.config'

describe('env.config', () => {
	it('should return environment configuration', () => {
		process.env = {
			MONGO_DATABASE: 'testdb',
			MONGO_HOST: 'localhost',
			MONGO_PORT: '27017',
			MONGO_PROTOCOL: 'mongodb',
			MONGO_USER: 'testuser',
			MONGO_PASSWORD: 'testpassword',
			APP_API_BOOK_SERVICE_NAME: 'book-service',
			RMQ_HOST: 'rabbitmq',
			RMQ_PORT: '5672',
			RMQ_PROTOCOL: 'amqp',
			RMQ_USER: 'rabbituser',
			RMQ_PASSWORD: 'rabbitpassword',
			RMQ_VHOST: 'bookhood',
			RMQ_GATEWAY_QUEUE: 'gateway_queue',
			RMQ_MAIL_QUEUE: 'mail_queue',
			RMQ_USER_QUEUE: 'user_queue',
			RMQ_BOOK_QUEUE: 'book_queue',
			SESSION_DURATION: '3600',
			APP_GOOGLE_API_KEY: 'googleapikey',
		}

		const config = envConfig()

		expect(config.mongo.database).toBe('testdb')
		expect(config.mongo.host).toBe('localhost')
		expect(config.mongo.port).toBe(27017)
		expect(config.mongo.protocol).toBe('mongodb')
		expect(config.mongo.user).toBe('testuser')
		expect(config.mongo.password).toBe('testpassword')
		expect(config.gateway.book.serviceName).toBe('book-service')
		expect(config.rabbitmq.host).toBe('rabbitmq')
		expect(config.rabbitmq.port).toBe(5672)
		expect(config.rabbitmq.protocol).toBe('amqp')
		expect(config.rabbitmq.user).toBe('rabbituser')
		expect(config.rabbitmq.password).toBe('rabbitpassword')
		expect(config.rabbitmq.vhost).toBe('bookhood')
		expect(config.rabbitmq.queues.gateway).toBe('gateway_queue')
		expect(config.rabbitmq.queues.mail).toBe('mail_queue')
		expect(config.rabbitmq.queues.user).toBe('user_queue')
		expect(config.rabbitmq.queues.book).toBe('book_queue')
		expect(config.settings.sessionDuration).toBe(3600)
		expect(config.externalApis.google.key).toBe('googleapikey')
	})
})
