import { Test, TestingModule } from '@nestjs/testing'
import { MailModule } from '../../src/app/mail.module'
import { ConfigModule } from '@nestjs/config'
import envConfig from '../../src/config/env.config'
import { ApplicationModule } from '../../src/app/application/application.module'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { winstonConfig } from '@bookhood/shared'
import { InfrastructureModule } from '../../src/app/infrastructure/infrastructure.module'
import { DomainModule } from '../../src/app/domain/domain.module'
import { AwsSdkModule } from 'nest-aws-sdk'
import { SES } from 'aws-sdk'
import { SESManagerModule } from '../../src/app/infrastructure/adapters/aws/ses/awsses.module'
import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nModule,
	QueryResolver,
} from 'nestjs-i18n'
import * as path from 'path'

describe('MailModule', () => {
	let module: TestingModule

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [MailModule],
		}).compile()
	})

	it('should be defined', () => {
		expect(module.get<MailModule>(MailModule)).toBeDefined()
		expect(module.get<ConfigModule>(ConfigModule)).toBeDefined()
		expect(module.get<ApplicationModule>(ApplicationModule)).toBeDefined()
		expect(module.get<DomainModule>(DomainModule)).toBeDefined()
		expect(
			module.get<InfrastructureModule>(InfrastructureModule)
		).toBeDefined()
		expect(module.get<WinstonModule>(WinstonModule)).toBeDefined()
		expect(module.get<SESManagerModule>(SESManagerModule)).toBeDefined()
		expect(module.get<AwsSdkModule>(AwsSdkModule)).toBeDefined()
		expect(module.get<I18nModule>(I18nModule)).toBeDefined()
	})
})
