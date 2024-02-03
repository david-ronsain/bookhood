import { Test, TestingModule } from '@nestjs/testing'
import { BookModule } from '../../src/app/book.module'
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston'
import { ConfigModule } from '@nestjs/config'
import { ApplicationModule } from '../../src/app/application/application.module'
import { InfrastructureModule } from '../../src/app/infrastructure/infrastructure.module'
import { DomainModule } from '../../src/app/domain/domain.module'

describe('BookModule', () => {
	let module: TestingModule

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	beforeAll(async () => {
		module = await Test.createTestingModule({
			imports: [BookModule],
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

	// You can add more specific tests for the imported modules, configurations, etc.
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
