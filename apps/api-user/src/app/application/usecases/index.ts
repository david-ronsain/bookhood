import CreateUserUseCase from './createUser.usecase'
import CreateAuthLinkUseCase from './createAuthLink.usecase'
import UserEmailExistsUseCase from './getUserByEmail.usecase'
import VerifyAuthTokenUseCase from './verifyAuthToken.usecase'

export const USER_USECASES = [
	CreateUserUseCase,
	CreateAuthLinkUseCase,
	UserEmailExistsUseCase,
	VerifyAuthTokenUseCase,
]
