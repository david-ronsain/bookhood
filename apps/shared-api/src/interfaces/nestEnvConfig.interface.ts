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
	sessionToken?: string
	allowedOrigins?: string[]
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
	book?: INestEnvConfigGatewayGenericService
	conversation?: INestEnvConfigGatewayGenericService
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
	user?: string
	book?: string
	conversation?: string
	library?: string
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
	localeToken: string
}

interface INestEnvConfigFront {
	protocol: string
	port: number
	host: string
}

interface INestEnvConfigExternalApisGoogle {
	key?: string
}

interface INestEnvConfigExternalApis {
	google?: INestEnvConfigExternalApisGoogle
}

interface INestEnvConfigSocket {
	port: number
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
	externalApis?: INestEnvConfigExternalApis
	socket?: INestEnvConfigSocket
}
