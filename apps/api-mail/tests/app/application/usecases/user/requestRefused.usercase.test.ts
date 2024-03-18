/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import RequestRefusedUseCase from '../../../../../src/app/application/usecases/request/requestRefused.usecase'
import { requestInfos } from '../../../../../../shared-api/test'

describe('Testing the RequestRefusedUseCase', () => {
	let usecase: RequestRefusedUseCase
	let mailer: IMailer

	beforeEach(async () => {
		mailer = {
			requestRefused: jest.fn(),
		} as unknown as IMailer

		const module = await Test.createTestingModule({
			providers: [
				RequestRefusedUseCase,
				{
					provide: 'Mailer',
					useValue: mailer,
				},
			],
		}).compile()
		usecase = module.get<RequestRefusedUseCase>(RequestRefusedUseCase)
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			usecase.handler(requestInfos)
			expect(mailer.requestRefused).toHaveBeenCalledWith(requestInfos)
		})
	})
})
