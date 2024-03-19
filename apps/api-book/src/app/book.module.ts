import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import envConfig from '../config/env.config'
import { ApplicationModule } from './application/application.module'
import { DomainModule } from './domain/domain.module'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n'
import path from 'path'

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
			winstonConfig(winston, envConfig().gateway.book.serviceName),
		),
		I18nModule.forRoot({
			fallbackLanguage: envConfig().i18n.fallbackLocale,
			resolvers: [
				{
					use: QueryResolver,
					options: ['lang', 'lg', 'locale'],
				},
				{
					use: HeaderResolver,
					options: ['x-lang', 'x-lg', 'x-locale'],
				},
				AcceptLanguageResolver,
			],
			loaderOptions: {
				path: path.join(__dirname, '/app/application/locales/'),
				watch: true,
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class BookModule {}
