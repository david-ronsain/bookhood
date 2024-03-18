/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-var-requires */
import { Test, TestingModule } from '@nestjs/testing'
import { SESManagerService } from '../../../../../../src/app/infrastructure/adapters/aws/ses/awsses.service'
import { SES } from 'aws-sdk'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { createAwsServiceMock } from 'nest-aws-sdk/dist/testing'
import { I18nService } from 'nestjs-i18n'
import {
	BookRequestMailDTO,
	IRequestInfos,
} from '../../../../../../../shared/src'
import { requestInfos, userLight } from '../../../../../../../shared-api/test'
import { bookRequestMailDTO } from '../../../../../../../shared-api/test/data/mail/mail'

const mockI18nService = {
	t: jest.fn(),
}

describe('SESManagerService', () => {
	let service: SESManagerService
	let sesInstance: SES
	let loggerInstance: Logger

	beforeEach(async () => {
		jest.resetAllMocks()
		sesInstance = {
			sendEmail: jest.fn().mockReturnThis(),
			promise: jest.fn(() => Promise.resolve(() => ({ MessageId: '' }))),
		} as unknown as SES
		loggerInstance = {
			info: jest.fn(),
			error: jest.fn(),
		} as unknown as Logger

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SESManagerService,
				{
					provide: 'Mailer',
					useClass: SESManagerService,
				},
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: loggerInstance,
				},
				{
					provide: I18nService,
					useValue: mockI18nService,
				},
				createAwsServiceMock(SES, {
					useValue: sesInstance,
				}),
			],
		}).compile()

		service = module.get<SESManagerService>(SESManagerService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	describe('userRegistered', () => {
		it('should fail sending a user registration email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(service.userRegistered(userLight)).rejects.toThrow()
		})

		it('should send a user registration email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.userRegistered(userLight)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('authSendLink', () => {
		it('should fail sending a signin email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(service.authSendLink(userLight)).rejects.toThrow()
		})

		it('should send a signin email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.authSendLink(userLight)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('sendEmail', () => {
		it('should send an email', async () => {
			const from = 'sender@example.com'
			const to = ['recipient@example.com']
			const subject = 'Test Subject'
			const body = '<p>Test Body</p>'

			await service.sendEmail(from, to, subject, body, to, to)
			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('requestCreated', () => {
		it('should fail sending a request created email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(service.requestCreated(bookRequestMailDTO)).rejects.toThrow()
		})

		it('should send a request created email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.requestCreated(bookRequestMailDTO)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('requestAccepted', () => {
		it('should fail sending a request accepted email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(service.requestAccepted(requestInfos)).rejects.toThrow()
		})

		it('should send a request accepted email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.requestAccepted(requestInfos)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('requestRefused', () => {
		it('should fail sending a request refused email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(service.requestRefused(requestInfos)).rejects.toThrow()
		})

		it('should send a request refused email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.requestRefused(requestInfos)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('requestNeverReceived', () => {
		it('should fail sending a request never received email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(service.requestNeverReceived(requestInfos)).rejects.toThrow()
		})

		it('should send a request never received email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.requestNeverReceived(requestInfos)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})

	describe('requestReturnedWithIssue', () => {
		it('should fail sending a request returned with issue email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => '')

			expect(
				service.requestReturnedWithIssue(requestInfos),
			).rejects.toThrow()
		})

		it('should send a request returned with issue email', async () => {
			const spy = jest.spyOn(
				SESManagerService.prototype as any,
				'parseTemplate',
			)
			spy.mockImplementation(() => 'template')

			await service.requestReturnedWithIssue(requestInfos)

			expect(sesInstance.sendEmail).toHaveBeenCalled()
			expect(loggerInstance.info).toHaveBeenCalled()
		})
	})
})
