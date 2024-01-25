/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { MailController } from '../../../../src/app/application/controllers/mail.controller'
import UserRegisteredUseCase from '../../../../src/app/application/usecases/user/userRegistered.usecase'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'

const moduleMocker = new ModuleMocker(global)
describe('Testing MailController', () => {
	let controller: MailController
	let usecase: UserRegisteredUseCase

	const mock = {
		handler: jest.fn(),
	} as unknown as UserRegisteredUseCase

	beforeEach(async () => {
		jest.resetAllMocks()

		const module = await Test.createTestingModule({
			controllers: [MailController],
			providers: [
				{
					provide: 'winston',
					useValue: () => ({}),
				},
			],
		})
			.useMocker((token) => {
				if (token === UserRegisteredUseCase) {
					return mock
				}
				if (typeof token === 'function') {
					const mockMetadata = moduleMocker.getMetadata(
						token
					) as MockFunctionMetadata<any, any>
					const Mock = moduleMocker.generateFromMetadata(mockMetadata)
					return new Mock()
				}
			})
			.compile()
		controller = module.get<MailController>(MailController)
		usecase = module.get<UserRegisteredUseCase>(UserRegisteredUseCase)
	})

	describe('The healthcheck', () => {
		it('should return "up"', () => {
			expect(controller.health()).toBe('up')
		})
	})

	describe('userRegistered method', () => {
		it('should call the usecase', () => {
			const spy = jest.spyOn(usecase, 'handler')
			controller.userRegistered({
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			})
			expect(spy).toHaveBeenCalledTimes(1)
		})
	})
})
