import CreateUserUseCase from './createUser.usecase'
import CreateAuthLinkUseCase from './createAuthLink.usecase'
import UserEmailExistsUseCase from './userEmailExists.usecase'
import VerifyAuthTokenUseCase from './verifyAuthToken.usecase'
import GetUserByEmailUseCase from './getUserByEmail.usecase'

export const USER_USECASES = [
	CreateUserUseCase,
	CreateAuthLinkUseCase,
	UserEmailExistsUseCase,
	VerifyAuthTokenUseCase,
	GetUserByEmailUseCase,
]
