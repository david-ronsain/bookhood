import { Module } from '@nestjs/common'

import { ConfigModule } from '@nestjs/config'
import envConfig from '../config/env.config'
import { ApplicationModule } from './application/application.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'
import { InfrastructureModule } from './infrastructure/infrastructure.module'
import { DomainModule } from './domain/domain.module'
import { AwsSdkModule } from 'nest-aws-sdk'
import { SES } from 'aws-sdk'
import { SESManagerModule } from './infrastructure/adapters/aws/ses/awsses.module'
import * as path from 'path'
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n'

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
			winstonConfig(winston, envConfig().gateway.mail.serviceName)
		),
		SESManagerModule,
		AwsSdkModule.forRoot({
			defaultServiceOptions: {
				region: envConfig().aws.region,
			},
			services: [SES],
		}),
		I18nModule.forRoot({
			fallbackLanguage: envConfig().i18n.fallbackLocale,
			viewEngine: 'hbs',
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
})
export class MailModule {}
