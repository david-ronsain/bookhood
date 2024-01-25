import { Test } from '@nestjs/testing'
import { DomainModule } from '../../../src/app/domain/domain.module'

describe('Testing the UserModule', () => {
	it('should compile the module', async () => {
		const module = await Test.createTestingModule({
			imports: [DomainModule],
		}).compile()

		expect(module).toBeDefined()
	})
})
