import { Session } from './session.interface'

export interface BookRequestMailDTO extends Session {
	book: string

	emitterFirstName: string

	recipientFirstName: string

	email: string

	requestId: string
}
