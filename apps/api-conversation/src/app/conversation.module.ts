import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import envConfig from '../config/env.config'
import { ApplicationModule } from './application/application.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { DomainModule } from './domain/domain.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [envConfig],
		}),
		ApplicationModule,
		DomainModule,
		InfrastructureModule,
		WinstonModule.forRoot(
			winstonConfig(
				winston,
				envConfig().gateway.conversation.serviceName,
			),
		),
	],
})
export class ConversationModule {}
