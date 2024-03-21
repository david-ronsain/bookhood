import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { INestEnvConfigSettings } from '@bookhood/shared-api'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import { AppModule } from './app/app.module'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { LoggerInterceptor } from './app/application/interceptors'
import { HttpExceptionFilter } from './app/application/filters'
import envConfig from './config/env.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: {
			methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
			optionsSuccessStatus: HttpStatus.OK,
			origin: envConfig().settings.allowedOrigins,
		},
	})

	app.use(helmet())

	app.use(
		rateLimit({
			windowMs: 60 * 1000,
			limit: 1000,
		}),
	)

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			forbidUnknownValues: true,
			stopAtFirstError: true,
		}),
	)

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

	const config = app.get<ConfigService>(ConfigService)

	const options = new DocumentBuilder()
		.setTitle('API docs')
		.addTag('users')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup(
		config.get<INestEnvConfigSettings>('settings').docPrefix,
		app,
		document,
	)

	app.useGlobalInterceptors(
		new LoggerInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)),
	)

	app.useGlobalFilters(
		new HttpExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER)),
	)

	app.setGlobalPrefix(
		config.get<INestEnvConfigSettings>('settings').apiPrefix,
	)
	await app.listen(process.env.APP_API_GATEWAY_PORT)

	Logger.log(
		`🚀 Application is running on: ${
			config.get<INestEnvConfigSettings>('settings').protocol
		}://${config.get<INestEnvConfigSettings>('settings').host}:${
			config.get<INestEnvConfigSettings>('settings').port
		}/${config.get<INestEnvConfigSettings>('settings').apiPrefix}`,
	)
}

bootstrap()
