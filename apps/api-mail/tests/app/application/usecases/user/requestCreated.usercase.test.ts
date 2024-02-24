/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import { BookRequestMailDTO } from '../../../../../../shared/src'
import RequestCreatedUseCase from '../../../../../src/app/application/usecases/request/requestCreated.usecase'

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
			const infos: BookRequestMailDTO = {
				book: 'title',
				emitterFirstName: 'emitter',
				recipientFirstName: 'recipient',
				email: 'first.last@name.test',
				requestId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
			}
			usecase.handler(infos)
			expect(mailer.requestCreated).toHaveBeenCalledWith(infos)
		})
	})
})
