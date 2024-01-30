import { Test, TestingModule } from '@nestjs/testing'
import { MailController } from '../../../../src/app/application/controllers/mail.controller'
import { IUser } from '@bookhood/shared'
import UserRegisteredUseCase from '../../../../src/app/application/usecases/user/userRegistered.usecase'
import AuthSendLinkUseCase from '../../../../src/app/application/usecases/user/authSendLink.usecase'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import envConfig from '../../../../src/config/env.config'

describe('MailController', () => {
	let controller: MailController

	const mockLogger = {
		info: jest.fn(),
		error: jest.fn(),
	}

	const mockUserRegisteredUseCase = {
		handler: jest.fn(),
	}

	const mockAuthSendLinkUseCase = {
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
					useValue: mockUserRegisteredUseCase,
				},
				{
					provide: AuthSendLinkUseCase,
					useValue: mockAuthSendLinkUseCase,
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

		expect(mockUserRegisteredUseCase.handler).toHaveBeenCalledWith(mockUser)
	})

	it('should handle mail-auth-send-link', () => {
		const mockUser: IUser = {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		}

		controller.authSendLink(mockUser)

		expect(mockAuthSendLinkUseCase.handler).toHaveBeenCalledWith(mockUser)
	})
})
