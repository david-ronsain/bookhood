import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import envConfig from '../config/env.config'
import { ApplicationModule } from './application/application.module'
import { DomainModule } from './domain/domain.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [envConfig],
		}),
		ApplicationModule,
		InfrastructureModule,
		DomainModule,
		WinstonModule.forRoot(
			winstonConfig(winston, envConfig().gateway.user.serviceName)
		),
	],
	controllers: [],
	providers: [],
})
export class UserModule {}
