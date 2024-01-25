/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get, Inject } from '@nestjs/common'
import {
	HealthCheckService,
	HttpHealthIndicator,
	HealthCheck,
	MongooseHealthIndicator,
	MicroserviceHealthIndicator,
	HealthIndicatorFunction,
	HealthIndicatorResult,
	HealthCheckResult,
} from '@nestjs/terminus'
import envConfig from '../config/env.config'
import { ClientProxy, RedisOptions, Transport } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Controller()
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private mongo: MongooseHealthIndicator,
		private microservice: MicroserviceHealthIndicator,
		@Inject('RabbitMQGateway') private readonly gatewayClient: ClientProxy,
		@Inject('RabbitMQMail') private readonly mailClient: ClientProxy,
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
	) {}

	@Get()
	@HealthCheck()
	async check() {
		const services: Promise<HealthIndicatorResult>[] = []
		Object.keys(envConfig().gateway)
			.filter(
				(service: string) =>
					![
						envConfig().gateway.gateway.serviceName,
						envConfig().gateway.mail.serviceName,
					].includes(`api-${service}`)
			)
			.forEach((service: string) => {
				services.push(
					new Promise<HealthIndicatorResult>((resolve) => {
						let promise
						const timeout = setTimeout(() => {
							promise = null
							resolve(
								new Promise((resolve) =>
									resolve({
										[`api-${service}`]: { status: 'down' },
									})
								)
							)
						}, 3000)
						promise = firstValueFrom(
							this.gatewayClient.send(`${service}-health`, {})
						).then(() => {
							clearTimeout(timeout)
							return resolve({
								[`api-${service}`]: { status: 'up' },
							})
						})
					})
				)
			})

		const checks: HealthIndicatorFunction[] = [
			() => this.mongo.pingCheck('mongoDB'),
			() =>
				this.http.pingCheck(
					envConfig().gateway.gateway.serviceName,
					`${envConfig().settings.protocol}://${
						envConfig().settings.host
					}:${envConfig().settings.port}/${
						envConfig().settings.docPrefix
					}`
				),
			() =>
				new Promise<HealthIndicatorResult>((resolve) => {
					let promise
					const timeout = setTimeout(() => {
						promise = null
						resolve(
							new Promise((resolve) =>
								resolve({ [`api-mail`]: { status: 'down' } })
							)
						)
					}, 3000)
					promise = firstValueFrom(
						this.mailClient.send(`mail-health`, {})
					).then(() => {
						clearTimeout(timeout)
						return resolve({ [`api-mail`]: { status: 'up' } })
					})
				}),
			() =>
				this.microservice.pingCheck<RedisOptions>(`redis`, {
					transport: Transport.REDIS,
					options: {
						host: envConfig().redis.host,
						port: envConfig().redis.port,
						username:
							envConfig()
								.redis.user.substring(0, -1)
								.split(':')[0] ?? undefined,
						password:
							envConfig()
								.redis.user.substring(0, -1)
								.split(':')[1] ?? undefined,
					},
				}),
		]

		services.forEach((service: Promise<HealthIndicatorResult>) => {
			checks.push(() => service)
		})

		let results: HealthCheckResult

		try {
			results = await this.health.check(checks)
		} catch (err) {
			results = err.response
		}
		const keys = Object.keys(results.error)
		if (keys.length) {
			this.logger.error('HEALTHCHECK FAILED', {
				servicesDown: Object.keys(results.error),
			})
		} else {
			this.logger.info('Healthcheck successful', {
				servicesUp: Object.keys(results.details),
			})
		}

		return results
	}
}
