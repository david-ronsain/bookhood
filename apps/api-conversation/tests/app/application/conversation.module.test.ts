import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { ApplicationModule } from '../../../src/app/application/application.module'
import { CONVERSATION_USECASES } from '../../../src/app/application/usecases'
import envConfig from '../../../src/config/env.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
import ConversationSchema from '../../../src/app/infrastructure/adapters/repository/schemas/conversation.schema'
import { ConversationController } from '../../../src/app/application/controllers/conversation.controller'
import ConversationRepositoryMongo from '../../../src/app/infrastructure/adapters/repository/conversation.repository.mongo'
import { I18nModule } from 'nestjs-i18n'
import { MQResolver } from '../../../../shared-api/src'
import path from 'path'

describe('Testing the ApplicationModule', () => {
	let module: TestingModule

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				WinstonModule.forRoot({}),
				MongooseModule.forRootAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: () => ({
						uri: `${envConfig().mongo.protocol}://${
							envConfig().mongo.user
								? envConfig().mongo.user +
									':' +
									envConfig().mongo.password +
									'@'
								: ''
						}${
							envConfig().mongo.host
						}:${envConfig().mongo.port.toString()}/${
							envConfig().mongo.database
						}`,
					}),
				}),
				MongooseModule.forFeature([
					{
						name: 'Conversation',
						schema: ConversationSchema,
					},
				]),
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
				ApplicationModule,
			],
		}).compile()
	})

	it('should be defined', () => {
		expect(module).toBeDefined()
	})

	it('should import MongooseModule with correct configuration', () => {
		const mongooseModule = module.get(MongooseModule)
		expect(mongooseModule).toBeDefined()
	})

	it('should import UserModule with correct configuration', () => {
		const appModule = module.get(ApplicationModule)
		expect(appModule).toBeDefined()
	})

	it('should import CONVERSATION_USECASES', () => {
		for (const useCase of CONVERSATION_USECASES) {
			expect(module.get(useCase)).toBeDefined()
		}
	})

	it('should import ConversationController', () => {
		const controller = module.get(ConversationController)
		expect(controller).toBeDefined()
	})

	it('should provide ConversationRepositoryMongo', () => {
		const repo = module.get('ConversationRepository')
		expect(repo).toBeInstanceOf(ConversationRepositoryMongo)
	})

	it('should provide RabbitMail', () => {
		const rabbitUser = module.get('RabbitUser')
		expect(rabbitUser).toBeDefined()
	})
})
