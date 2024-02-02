import { Test, TestingModule } from '@nestjs/testing'
import { UserModule } from '../../src/app/user.module'
import { ConfigModule } from '@nestjs/config'
import { ApplicationModule } from '../../src/app/application/application.module'
import { InfrastructureModule } from '../../src/app/infrastructure/infrastructure.module'
import { DomainModule } from '../../src/app/domain/domain.module'
import envConfig from '../../src/config/env.config'

describe('Testing the UserModule', () => {
	let module: TestingModule

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [envConfig],
				}),
				ApplicationModule,
				InfrastructureModule,
				DomainModule,
				UserModule,
			],
		}).compile()
	})

	it('should be defined', () => {
		expect(module).toBeDefined()
	})

	it('should import ConfigModule', () => {
		expect(module.get(ConfigModule)).toBeDefined()
	})

	it('should import ApplicationModule', () => {
		expect(module.get(ApplicationModule)).toBeDefined()
	})

	it('should import InfrastructureModule', () => {
		expect(module.get(InfrastructureModule)).toBeDefined()
	})

	it('should import DomainModule', () => {
		expect(module.get(DomainModule)).toBeDefined()
	})

	it('should import UserModule', () => {
		expect(module.get(UserModule)).toBeDefined()
	})
})
