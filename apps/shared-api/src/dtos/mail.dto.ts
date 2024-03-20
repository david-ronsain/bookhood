import {
	Session,
	IRequestInfos,
	IRequestInfosBook,
	IRequestInfosUser,
} from '@bookhood/shared'

export interface AuthSendLinkDTO extends Session {
	firstName: string

	email: string
}

export class RequestInfosDTO extends Session implements IRequestInfos {
	_id: string

	createdAt: string

	owner: IRequestInfosUser

	emitter: IRequestInfosUser

	book: IRequestInfosBook
}
