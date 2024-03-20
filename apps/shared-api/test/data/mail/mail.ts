/* eslint-disable @nx/enforce-module-boundaries */
import { BookRequestMailDTO, Locale } from '../../../../shared/src'

export const bookRequestMailDTO: BookRequestMailDTO = {
	book: 'title',
	emitterFirstName: 'emitter',
	recipientFirstName: 'recipient',
	email: 'first.last@name.test',
	requestId: 'aaaaaaaaaaaaaaaaaaaaaaaa',
	session: {
		locale: Locale.FR,
		token: 'token',
	},
}
