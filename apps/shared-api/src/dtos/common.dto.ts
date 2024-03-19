import { Locale } from '@bookhood/shared'
import { CurrentUser } from '../interfaces'

export class DTOWithAuth {
	user?: CurrentUser

	locale: Locale
}
