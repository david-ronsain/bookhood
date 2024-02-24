/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import { IRequestInfos } from '../../../../../../shared/src'
import RequestNeverReceivedUseCase from '../../../../../src/app/application/usecases/request/requestNeverReceived.usecase'

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
			const user: IRequestInfos = {
				_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
				createdAt: new Date().toString(),
				owner: {
					firstName: '',
					lastName: '',
					email: 'email@fake.test',
				},
				emitter: {
					firstName: '',
					lastName: '',
					email: 'email2@fake.test',
				},
				book: {
					title: 'title',
				},
			}
			usecase.handler(user)
			expect(mailer.requestNeverReceived).toHaveBeenCalledWith(user)
		})
	})
})
