import { Test, TestingModule } from '@nestjs/testing'
import { MailController } from '../../../../src/app/application/controllers/mail.controller'
import { IUser } from '@bookhood/shared'
import UserRegisteredUseCase from '../../../../src/app/application/usecases/user/userRegistered.usecase'
import AuthSendLinkUseCase from '../../../../src/app/application/usecases/user/authSendLink.usecase'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import envConfig from '../../../../src/config/env.config'
import RequestCreatedUseCase from '../../../../src/app/application/usecases/request/requestCreated.usecase'
import RequestAcceptedUseCase from '../../../../src/app/application/usecases/request/requestAccepted.usecase'
import RequestRefusedUseCase from '../../../../src/app/application/usecases/request/requestRefused.usecase'
import RequestNeverReceivedUseCase from '../../../../src/app/application/usecases/request/requestNeverReceived.usecase'
import RequestReturnedWithIssueUseCase from '../../../../src/app/application/usecases/request/requestReturnedWithIssue.usecase'
import { BookRequestMailDTO, IRequestInfos } from '../../../../../shared/src'

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
			controllers: [MailController],
			providers: [
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
			],
		}).compile()

		controller = module.get<MailController>(MailController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	it('should handle mail-health', () => {
		const result = controller.health()
		expect(result).toEqual('up')
	})

	it('should handle mail-user-registered', () => {
		const mockUser: IUser = {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		}

		controller.userRegistered(mockUser)

		expect(mock.handler).toHaveBeenCalledWith(mockUser)
	})

	it('should handle mail-auth-send-link', () => {
		const mockUser: IUser = {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		}

		controller.authSendLink(mockUser)

		expect(mock.handler).toHaveBeenCalledWith(mockUser)
	})

	it('should handle mail-request-created', () => {
		const mockDTO: BookRequestMailDTO = {
			book: 'title',
			emitterFirstName: 'emitter',
			recipientFirstName: 'recipient',
			email: 'first.last@name.test',
			requestId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
		}

		controller.requestCreated(mockDTO)

		expect(mock.handler).toHaveBeenCalledWith(mockDTO)
	})

	it('should handle mail-request-accepted', () => {
		const mockDTO: IRequestInfos = {
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

		controller.requestAccepted(mockDTO)

		expect(mock.handler).toHaveBeenCalledWith(mockDTO)
	})

	it('should handle mail-request-refused', () => {
		const mockDTO: IRequestInfos = {
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

		controller.requestRefused(mockDTO)

		expect(mock.handler).toHaveBeenCalledWith(mockDTO)
	})

	it('should handle mail-request-never-received', () => {
		const mockDTO: IRequestInfos = {
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

		controller.requestNeverReceived(mockDTO)

		expect(mock.handler).toHaveBeenCalledWith(mockDTO)
	})

	it('should handle mail-request-returned-with-issue', () => {
		const mockDTO: IRequestInfos = {
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

		controller.requestReturnedWithIssue(mockDTO)

		expect(mock.handler).toHaveBeenCalledWith(mockDTO)
	})
})
