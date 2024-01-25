import { NestFactory } from '@nestjs/core'

import { HealthModule } from './app/health.module'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

async function bootstrap() {
	const app = await NestFactory.create(HealthModule)

	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))

	const port = process.env.PORT || 3001
	await app.listen(port)
}

bootstrap()
