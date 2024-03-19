import { Session } from '@bookhood/shared'
import { CurrentUser } from '../interfaces'

export class DTOWithAuth extends Session {
	user?: CurrentUser
}
