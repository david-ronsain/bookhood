/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import { Test } from '@nestjs/testing'
import { IMailer } from '../../../../../src/app/domain/ports/mailer.interface'
import { IRequestInfos, IUser } from '../../../../../../shared/src'
import RequestAcceptedUseCase from '../../../../../src/app/application/usecases/request/requestAccepted.usecase'

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
			expect(mailer.requestAccepted).toHaveBeenCalledWith(user)
		})
	})
})
