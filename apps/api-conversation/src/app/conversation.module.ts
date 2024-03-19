import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import envConfig from '../config/env.config'
import { ApplicationModule } from './application/application.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { DomainModule } from './domain/domain.module'
import { I18nModule } from 'nestjs-i18n'
import { MQResolver } from '@bookhood/shared-api'
import path from 'path'

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
		I18nModule.forRoot({
			fallbackLanguage: envConfig().i18n.fallbackLocale,
			resolvers: [
				{
					use: MQResolver,
					options: ['locale'],
				},
			],
			loaderOptions: {
				path: path.join(__dirname, '/app/application/locales/'),
				watch: true,
			},
		}),
	],
})
export class ConversationModule {}
