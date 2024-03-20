/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import { MailController } from '../../../../src/app/application/controllers/mail.controller'
import { IUser } from '@bookhood/shared'
import UserRegisteredUseCase from '../../../../src/app/application/usecases/user/userRegistered.usecase'
import AuthSendLinkUseCase from '../../../../src/app/application/usecases/user/authSendLink.usecase'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import RequestCreatedUseCase from '../../../../src/app/application/usecases/request/requestCreated.usecase'
import RequestAcceptedUseCase from '../../../../src/app/application/usecases/request/requestAccepted.usecase'
import RequestRefusedUseCase from '../../../../src/app/application/usecases/request/requestRefused.usecase'
import RequestNeverReceivedUseCase from '../../../../src/app/application/usecases/request/requestNeverReceived.usecase'
import RequestReturnedWithIssueUseCase from '../../../../src/app/application/usecases/request/requestReturnedWithIssue.usecase'
import { BookRequestMailDTO, IRequestInfos } from '../../../../../shared/src'
import { HealthCheckStatus } from '../../../../../shared-api/src'
import { requestInfos, userLight } from '../../../../../shared-api/test'
import { bookRequestMailDTO } from '../../../../../shared-api/test/data/mail/mail'
import { I18nService } from 'nestjs-i18n'
import envConfig from '../../../../../api-conversation/src/config/env.config'
import { ConfigModule } from '@nestjs/config'

describe('MailController', () => {
	let controller: MailController

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	const mock = {
		handler: jest.fn(),
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [envConfig],
				}),
			],
			controllers: [MailController],
			providers: [
				{ provide: 'RabbitUser', useValue: { send: jest.fn() } },
				{
					provide: WINSTON_MODULE_PROVIDER,
					useValue: mockLogger,
				},
				{
					provide: UserRegisteredUseCase,
					useValue: mock,
				},
				{
					provide: AuthSendLinkUseCase,
					useValue: mock,
				},
				{
					provide: RequestCreatedUseCase,
					useValue: mock,
				},
				{
					provide: RequestAcceptedUseCase,
					useValue: mock,
				},
				{
					provide: RequestRefusedUseCase,
					useValue: mock,
				},
				{
					provide: RequestNeverReceivedUseCase,
					useValue: mock,
				},
				{
					provide: RequestReturnedWithIssueUseCase,
					useValue: mock,
				},
				{
					provide: I18nService,
					useValue: {
						t: jest.fn(),
					},
				},
			],
		}).compile()

		controller = module.get<MailController>(MailController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should handle mail-health', () => {
		const result = controller.health()
		expect(result).toEqual(HealthCheckStatus.UP)
	})

	it('should handle mail-user-registered', () => {
		controller.userRegistered(userLight)

		expect(mock.handler).toHaveBeenCalledWith(userLight)
	})

	it('should handle mail-auth-send-link', () => {
		controller.authSendLink(userLight)

		expect(mock.handler).toHaveBeenCalledWith(userLight)
	})

	it('should handle mail-request-created', () => {
		controller.requestCreated(bookRequestMailDTO)

		expect(mock.handler).toHaveBeenCalledWith(bookRequestMailDTO)
	})

	it('should handle mail-request-accepted', () => {
		controller.requestAccepted(requestInfos)

		expect(mock.handler).toHaveBeenCalledWith(requestInfos)
	})

	it('should handle mail-request-refused', () => {
		controller.requestRefused(requestInfos)

		expect(mock.handler).toHaveBeenCalledWith(requestInfos)
	})

	it('should handle mail-request-never-received', () => {
		controller.requestNeverReceived(requestInfos)

		expect(mock.handler).toHaveBeenCalledWith(requestInfos)
	})

	it('should handle mail-request-returned-with-issue', () => {
		controller.requestReturnedWithIssue(requestInfos)

		expect(mock.handler).toHaveBeenCalledWith(requestInfos)
	})
})
