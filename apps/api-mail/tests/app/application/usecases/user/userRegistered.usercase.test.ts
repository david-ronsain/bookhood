/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import UserRegisteredUseCase from '../../../../../src/app/application/usecases/user/userRegistered.usecase'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { userLight } from '../../../../../../shared-api/test'

const moduleMocker = new ModuleMocker(global)
describe('Testing the UserRegisteredUseCase', () => {
	let usecase: UserRegisteredUseCase
	let mailer: IMailer

	beforeEach(async () => {
		jest.resetAllMocks()

		const module = await Test.createTestingModule({
			imports: [UserRegisteredUseCase],
		})
			.useMocker((token) => {
				if (token === 'Mailer') {
					return {
						userRegistered: () => jest.fn(),
					}
				}
				if (typeof token === 'function') {
					const mockMetadata = moduleMocker.getMetadata(
						token,
					) as MockFunctionMetadata<any, any>
					const Mock = moduleMocker.generateFromMetadata(mockMetadata)
					return new Mock()
				}
			})
			.compile()
		usecase = module.get<UserRegisteredUseCase>(UserRegisteredUseCase)
		mailer = module.get<IMailer>('Mailer')
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			const spy = jest.spyOn(mailer, 'userRegistered')
			usecase.handler(userLight)
			expect(spy).toHaveBeenCalledTimes(1)
		})
	})
})
