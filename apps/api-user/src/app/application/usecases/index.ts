import CreateUserUseCase from './createUser.usecase'
import CreateAuthLinkUseCase from './createAuthLink.usecase'
import UserEmailExistsUseCase from './userEmailExists.usecase'
import VerifyAuthTokenUseCase from './verifyAuthToken.usecase'
import GetUserByEmailUseCase from './getUserByEmail.usecase'
import GetUserByTokenUseCase from './getUserByToken.usecase'
import GetUserByIdUseCase from './getUserById.usecase'
import RefreshToken from './refreshToken.usecase'

export const USER_USECASES = [
	CreateUserUseCase,
	CreateAuthLinkUseCase,
	UserEmailExistsUseCase,
	VerifyAuthTokenUseCase,
	GetUserByEmailUseCase,
	RefreshToken,
	GetUserByTokenUseCase,
	GetUserByIdUseCase,
]
