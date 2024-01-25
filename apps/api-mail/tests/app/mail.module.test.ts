import { Test } from '@nestjs/testing'
import { MailModule } from '../../src/app/mail.module'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'

const moduleMocker = new ModuleMocker(global)
describe('Testing the UserModule', () => {
	it('should compile the module', async () => {
		const module = await Test.createTestingModule({
			imports: [MailModule],
		})
			.useMocker((token) => {
				if (typeof token === 'function') {
					const mockMetadata = moduleMocker.getMetadata(
						token
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
					) as MockFunctionMetadata<any, any>
					const Mock = moduleMocker.generateFromMetadata(mockMetadata)
					return new Mock()
				}
			})
			.compile()

		expect(module).toBeDefined()
	})
})
