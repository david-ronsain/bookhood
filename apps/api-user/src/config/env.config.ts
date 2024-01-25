import { INestEnvConfig } from '@bookhood/shared-api'

export default (): INestEnvConfig => ({
	mongo: {
		database: process.env.MONGO_DATABASE || '',
		host: process.env.MONGO_HOST || '',
		port: parseInt(process.env.MONGO_PORT || ''),
		protocol: process.env.MONGO_PROTOCOL || '',
		user: process.env.MONGO_USER || '',
	},
	gateway: {
		user: {
			serviceName: process.env.APP_API_USER_SERVICE_NAME || '',
		},
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
			mail: process.env.RMQ_MAIL_QUEUE || '',
		},
	},
})
