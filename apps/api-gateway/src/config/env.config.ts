import { INestEnvConfig } from '@bookhood/shared-api'

export default (): INestEnvConfig => ({
	settings: {
		apiPrefix: process.env.APP_API_GATEWAY_PREFIX || '',
		host: process.env.APP_API_GATEWAY_HOST || '',
		port: parseInt(process.env.APP_API_GATEWAY_PORT || ''),
		docPrefix: process.env.APP_API_GATEWAY_DOC || '',
		protocol: (process.env.APP_API_GATEWAY_PROTOCOL || '') as
			| 'http'
			| 'https',
	},
	gateway: {
		user: {
			host: process.env.APP_API_USER_HOST || '',
			port: parseInt(process.env.APP_API_USER_PORT || ''),
			token: process.env.APP_API_GATEWAY_USER_TOKEN || '',
			serviceName: process.env.APP_API_USER_SERVICE_NAME || '',
		},
		gateway: {
			serviceName: process.env.APP_API_GATEWAY_SERVICE_NAME || '',
		},
	},
	redis: {
		host: process.env.REDIS_HOST || '',
		port: parseInt(process.env.REDIS_PORT || ''),
		ttl: parseInt(process.env.REDIS_TTL || ''),
		user: process.env.REDIS_USER || '',
		protocol: (process.env.REDIS_PASSWORD || 'redis') as 'redis',
	},
	mongo: {
		database: process.env.MONGO_DATABASE || '',
		host: process.env.MONGO_HOST || '',
		port: parseInt(process.env.MONGO_PORT || ''),
		protocol: process.env.MONGO_PROTOCOL || '',
		user: process.env.MONGO_USER || '',
		password: process.env.MONGO_PASSWORD || '',
	},
	rabbitmq: {
		host: process.env.RMQ_HOST || '',
		port: parseInt(process.env.RMQ_PORT || ''),
		protocol: (process.env.RMQ_PROTOCOL || '') as 'amqp',
		user: process.env.RMQ_USER || '',
		password: process.env.RMQ_PASSWORD || '',
		vhost: process.env.RMQ_VHOST || '',
		queues: {
			gateway: process.env.RMQ_GATEWAY_QUEUE || '',
			user: process.env.RMQ_USER_QUEUE || '',
			book: process.env.RMQ_BOOK_QUEUE || '',
			conversation: process.env.RMQ_CONVERSATION_QUEUE || '',
		},
	},
	externalApis: {
		google: {
			key: process.env.APP_GOOGLE_BOOK_API_KEY || '',
		},
	},
	socket: {
		port: parseInt(process.env.APP_WEBSOCKET_PORT || ''),
	},
})
