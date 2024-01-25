import { Test } from '@nestjs/testing'
import { AppModule } from '../../src/app/app.module'

describe('Testing the AppModule', () => {
	it('should compile the module', async () => {
		const module = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		expect(module).toBeDefined()
	})
})
