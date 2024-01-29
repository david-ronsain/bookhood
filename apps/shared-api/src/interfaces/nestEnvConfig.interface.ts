export interface INestEnvConfigSettings {
	protocol?: 'http' | 'https'
	host?: string
	externalHost?: string
	port?: number
	apiPrefix?: string
	docPrefix?: string
	env?: string
	mailFrom?: string
	mailTo?: string
	sessionDuration?: number
}

interface INestEnvConfigGatewayUserService {
	host?: string
	port?: number
	token?: string
	serviceName?: string
}

interface INestEnvConfigGatewayGenericService {
	serviceName?: string
}

export interface INestEnvConfigGateway {
	user?: INestEnvConfigGatewayUserService
	gateway?: INestEnvConfigGatewayGenericService
	mail?: INestEnvConfigGatewayGenericService
}

interface INestEnvConfigMongo {
	protocol: string
	port: number
	host: string
	database: string
	user: string
	password: string
}

interface INestEnvConfigRedis {
	host: string
	port: number
	ttl: number
	protocol: 'redis'
	user: string
}

interface INestEnvConfigRabbitMQ {
	host: string
	port: number
	vhost: string
	protocol: 'amqp'
	user: string
	password: string
	queues: INestEnvConfigRabbitMQQueues
}

interface INestEnvConfigRabbitMQQueues {
	gateway?: string
	mail?: string
}

interface INestEnvConfigAWS {
	accessKey: string
	secret: string
	region: string
}

interface INestEnvConfigI18n {
	availableLocales: string[]
	defaultLocale: string
	fallbackLocale: string
}

interface INestEnvConfigFront {
	protocol: string
	port: number
	host: string
}

export interface INestEnvConfig {
	settings?: INestEnvConfigSettings
	gateway?: INestEnvConfigGateway
	mongo?: INestEnvConfigMongo
	redis?: INestEnvConfigRedis
	rabbitmq?: INestEnvConfigRabbitMQ
	aws?: INestEnvConfigAWS
	i18n?: INestEnvConfigI18n
	front?: INestEnvConfigFront
}
