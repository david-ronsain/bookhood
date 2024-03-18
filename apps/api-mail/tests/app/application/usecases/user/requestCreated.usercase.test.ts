/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import RequestCreatedUseCase from '../../../../../src/app/application/usecases/request/requestCreated.usecase'
import { bookRequestMailDTO } from '../../../../../../shared-api/test/data/mail/mail'

describe('Testing the RequestCreatedUseCase', () => {
	let usecase: RequestCreatedUseCase
	let mailer: IMailer

	beforeEach(async () => {
		mailer = {
			requestCreated: jest.fn(),
		} as unknown as IMailer

		const module = await Test.createTestingModule({
			providers: [
				RequestCreatedUseCase,
				{
					provide: 'Mailer',
					useValue: mailer,
				},
			],
		}).compile()
		usecase = module.get<RequestCreatedUseCase>(RequestCreatedUseCase)
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			usecase.handler(bookRequestMailDTO)
			expect(mailer.requestCreated).toHaveBeenCalledWith(
				bookRequestMailDTO,
			)
		})
	})
})
