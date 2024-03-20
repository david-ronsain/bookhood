/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { MongooseModule } from '@nestjs/mongoose'
import { ApplicationModule } from '../../../src/app/application/application.module'
import UserSchema from '../../../src/app/infrastructure/adapters/repository/schemas/user.schema'
import { USER_USECASES } from '../../../src/app/application/usecases'
import { UserController } from '../../../src/app/application/controllers/user.controller'
import { AuthController } from '../../../src/app/application/controllers/auth.controller'
import UserRepositoryMongo from '../../../src/app/infrastructure/adapters/repository/user.repository.mongo'
import envConfig from '../../../src/config/env.config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { WinstonModule } from 'nest-winston'
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
						name: 'User',
						schema: UserSchema,
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
		const userModule = module.get(ApplicationModule)
		expect(userModule).toBeDefined()
	})

	it('should import USER_USECASES', () => {
		for (const useCase of USER_USECASES) {
			expect(module.get(useCase)).toBeDefined()
		}
	})

	it('should import UserController', () => {
		const userController = module.get(UserController)
		expect(userController).toBeDefined()
	})

	it('should import AuthController', () => {
		const authController = module.get(AuthController)
		expect(authController).toBeDefined()
	})

	it('should provide UserRepositoryMongo', () => {
		const userRepository = module.get('UserRepository')
		expect(userRepository).toBeInstanceOf(UserRepositoryMongo)
	})

	it('should provide RabbitMail', () => {
		const rabbitMail = module.get('RabbitMail')
		expect(rabbitMail).toBeDefined()
	})
})
