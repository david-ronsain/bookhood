/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import AuthSendLinkUseCase from '../../../../../src/app/application/usecases/user/authSendLink.usecase'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { IUser } from '../../../../../../shared/src'

const moduleMocker = new ModuleMocker(global)
describe('Testing the AuthSendLinkUseCase', () => {
	let usecase: AuthSendLinkUseCase
	let mailer: IMailer

	beforeEach(async () => {
		mailer = {
			authSendLink: jest.fn(),
		} as unknown as IMailer

		const module = await Test.createTestingModule({
			providers: [
				AuthSendLinkUseCase,
				{
					provide: 'Mailer',
					useValue: mailer,
				},
			],
		}).compile()
		usecase = module.get<AuthSendLinkUseCase>(AuthSendLinkUseCase)
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			const user: IUser = {
				firstName: 'first',
				lastName: 'last',
				email: 'first.last@name.test',
			}
			usecase.handler(user)
			expect(mailer.authSendLink).toHaveBeenCalledWith(user)
		})
	})
})
