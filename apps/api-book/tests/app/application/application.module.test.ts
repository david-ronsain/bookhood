/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { ApplicationModule } from '../../../src/app/application/application.module'
import { InfrastructureModule } from '../../../src/app/infrastructure/infrastructure.module'
import { WinstonModule } from 'nest-winston'
import { winstonConfig } from '../../../../shared/src'
import envConfig from '../../../src/config/env.config'
import * as winston from 'winston'

describe('Testing the UserModule', () => {
	it('should compile the module', async () => {
		const module = await Test.createTestingModule({
			imports: [
				ApplicationModule,
				InfrastructureModule,
				WinstonModule.forRoot(
					winstonConfig(winston, envConfig().gateway.user.serviceName)
				),
			],
		}).compile()

		expect(module).toBeDefined()
	})
})
