import { INestEnvConfig } from '@bookhood/shared-api'

export default (): INestEnvConfig => ({
	gateway: {
		mail: {
			serviceName: process.env.APP_API_MAIL_SERVICE_NAME || '',
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
			mail: process.env.RMQ_MAIL_QUEUE || '',
		},
	},
	settings: {
		env: process.env.NODE_ENV || '',
		mailFrom: process.env.EMAIL_FROM || '',
		mailTo: process.env.EMAIL_TO || '',
	},
	aws: {
		accessKey: process.env.AWS_ACCESS_KEY_ID || '',
		secret: process.env.AWS_SECRET_ACCESS_KEY || '',
		region: process.env.AWS_REGION || '',
	},
	i18n: {
		availableLocales: (process.env.I18N_AVAILABLE_LOCALES || '').split(','),
		defaultLocale: process.env.I18N_FALLBACK_LOCALE || '',
		fallbackLocale: process.env.I18N_DEFAULT_LOCALE || '',
	},
	front: {
		host: process.env.APP_FRONT_HOST || '',
		port: parseInt(process.env.APP_FRONT_PORT || ''),
		protocol: process.env.APP_FRONT_PROTOCOL || '',
	},
})
