/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import RequestNeverReceivedUseCase from '../../../../../src/app/application/usecases/request/requestNeverReceived.usecase'
import { requestInfos } from '../../../../../../shared-api/test'

describe('Testing the RequestNeverReceivedUseCase', () => {
	let usecase: RequestNeverReceivedUseCase
	let mailer: IMailer

	beforeEach(async () => {
		mailer = {
			requestNeverReceived: jest.fn(),
		} as unknown as IMailer

		const module = await Test.createTestingModule({
			providers: [
				RequestNeverReceivedUseCase,
				{
					provide: 'Mailer',
					useValue: mailer,
				},
			],
		}).compile()
		usecase = module.get<RequestNeverReceivedUseCase>(
			RequestNeverReceivedUseCase,
		)
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			usecase.handler(requestInfos)
			expect(mailer.requestNeverReceived).toHaveBeenCalledWith(
				requestInfos,
			)
		})
	})
})
