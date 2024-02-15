import RequestAcceptedUseCase from './requestAccepted.usecase'
import RequestCreatedUseCase from './requestCreated.usecase'
import RequestRefusedUseCase from './requestRefused.usecase'
import RequestNeverReceivedUseCase from './requestNeverReceived.usecase'
import RequestReturnedWithIssue from './requestReturnedWithIssue.usecase'

export const REQUEST_USECASES = [
	RequestAcceptedUseCase,
	RequestCreatedUseCase,
	RequestRefusedUseCase,
	RequestNeverReceivedUseCase,
	RequestReturnedWithIssue,
]
