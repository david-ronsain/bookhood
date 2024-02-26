import { Test, TestingModule } from '@nestjs/testing'
import { ConversationModule } from '../../src/app/conversation.module'
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston'
import { ConfigModule } from '@nestjs/config'
import { ApplicationModule } from '../../src/app/application/application.module'
import { InfrastructureModule } from '../../src/app/infrastructure/infrastructure.module'
import { DomainModule } from '../../src/app/domain/domain.module'

describe('ConversationModule', () => {
	let module: TestingModule

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [ConversationModule],
			providers: [
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: mockLogger,
				},
			],
		}).compile()
	})

	it('should be defined', () => {
		expect(module).toBeDefined()
	})

	it('should import ConfigModule', () => {
		const configModule = module.get(ConfigModule)
		expect(configModule).toBeDefined()
	})

	it('should import ApplicationModule', () => {
		const appModule = module.get(ApplicationModule)
		expect(appModule).toBeDefined()
	})

	it('should import InfrastructureModule', () => {
		const infrastructureModule = module.get(InfrastructureModule)
		expect(infrastructureModule).toBeDefined()
	})

	it('should import DomainModule', () => {
		const domainModule = module.get(DomainModule)
		expect(domainModule).toBeDefined()
	})

	it('should configure WinstonModule', () => {
		const winstonModule = module.get(WinstonModule)
		expect(winstonModule).toBeDefined()
	})

	afterAll(async () => {
		await module.close()
	})
})
