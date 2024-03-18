/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import AuthSendLinkUseCase from '../../../../../src/app/application/usecases/user/authSendLink.usecase'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import { IUser } from '../../../../../../shared/src'
import { userLight } from '../../../../../../shared-api/test'

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
			usecase.handler(userLight)
			expect(mailer.authSendLink).toHaveBeenCalledWith(userLight)
		})
	})
})
