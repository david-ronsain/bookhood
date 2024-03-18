/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import RequestReturnedWithIssueUseCase from '../../../../../src/app/application/usecases/request/requestReturnedWithIssue.usecase'
import { requestInfos } from '../../../../../../shared-api/test'

describe('Testing the RequestReturnedWithIssueUseCase', () => {
	let usecase: RequestReturnedWithIssueUseCase
	let mailer: IMailer

	beforeEach(async () => {
		mailer = {
			requestReturnedWithIssue: jest.fn(),
		} as unknown as IMailer

		const module = await Test.createTestingModule({
			providers: [
				RequestReturnedWithIssueUseCase,
				{
					provide: 'Mailer',
					useValue: mailer,
				},
			],
		}).compile()
		usecase = module.get<RequestReturnedWithIssueUseCase>(
			RequestReturnedWithIssueUseCase,
		)
	})

	describe('Testing the handler method', () => {
		it('should call the mailer', () => {
			usecase.handler(requestInfos)
			expect(mailer.requestReturnedWithIssue).toHaveBeenCalledWith(
				requestInfos,
			)
		})
	})
})
