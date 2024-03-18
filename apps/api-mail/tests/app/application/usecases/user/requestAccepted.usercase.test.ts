/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import RequestAcceptedUseCase from '../../../../../src/app/application/usecases/request/requestAccepted.usecase'
import { requestInfos } from '../../../../../../shared-api/test'

describe('Testing the RequestAcceptedUseCase', () => {
	let usecase: RequestAcceptedUseCase
	let mailer: IMailer

	beforeEach(async () => {
		mailer = {
			requestAccepted: jest.fn(),
		} as unknown as IMailer

		const module = await Test.createTestingModule({
			providers: [
				RequestAcceptedUseCase,
				{
					provide: 'Mailer',
					useValue: mailer,
				},
			],
		}).compile()
		usecase = module.get<RequestAcceptedUseCase>(RequestAcceptedUseCase)
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			usecase.handler(requestInfos)
			expect(mailer.requestAccepted).toHaveBeenCalledWith(requestInfos)
		})
	})
})
