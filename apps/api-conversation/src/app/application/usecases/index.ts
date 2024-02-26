import GetOrCreateUseCase from './getOrCreate.usecase'
import AddMessageUseCase from './addMessage.usecase'
import FlagAsSeenUseCase from './flagAsSeen.usecase'

export const CONVERSATION_USECASES = [
	GetOrCreateUseCase,
	AddMessageUseCase,
	FlagAsSeenUseCase,
]
