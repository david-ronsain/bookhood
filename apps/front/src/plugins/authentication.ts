import { EnvConfig } from '../../config/env'
import { RequiresAuth } from '../enums/requiresAuth.enum'

export const isAccessGranted = (requiresAuth: RequiresAuth) => {
	const authenticated = isAuthenticated()
	return (
		(!authenticated && requiresAuth === RequiresAuth.NOT_AUTHENTICATED) ||
		(authenticated && requiresAuth === RequiresAuth.AUTHENTICATED) ||
		requiresAuth === RequiresAuth.BOTH
	)
}

export const isAuthenticated = (refreshToken: boolean = false): boolean => {
	const token = localStorage.getItem('user')?.split('|') ?? []
	let authenticated = false
	if (token.length === 3) {
		authenticated = parseInt(token[2]) > Date.now()
		if (refreshToken) {
			token[2] = (
				Date.now() + EnvConfig.settings.session.duration
			).toString()
			localStorage.setItem('user', token.join('|'))
		}
	}

	return authenticated
}
