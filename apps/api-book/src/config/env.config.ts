import { INestEnvConfig } from '@bookhood/shared-api'

export default (): INestEnvConfig => ({
	mongo: {
		database: process.env.MONGO_DATABASE || '',
		host: process.env.MONGO_HOST || '',
		port: parseInt(process.env.MONGO_PORT || ''),
		protocol: process.env.MONGO_PROTOCOL || '',
		user: process.env.MONGO_USER || '',
		password: process.env.MONGO_PASSWORD || '',
	},
	gateway: {
		book: {
			serviceName: process.env.APP_API_BOOK_SERVICE_NAME || '',
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
			user: process.env.RMQ_USER_QUEUE || '',
			book: process.env.RMQ_BOOK_QUEUE || '',
		},
	},
	settings: {
		sessionDuration: parseInt(process.env.SESSION_DURATION || ''),
	},
	externalApis: {
		google: {
			key: process.env.APP_GOOGLE_API_KEY || '',
		},
	},
	i18n: {
		availableLocales: (process.env.I18N_AVAILABLE_LOCALES || '').split(','),
		defaultLocale: process.env.I18N_FALLBACK_LOCALE || '',
		fallbackLocale: process.env.I18N_DEFAULT_LOCALE || '',
		localeToken: process.env.I18N_LOCALE_TOKEN || '',
	},
})
