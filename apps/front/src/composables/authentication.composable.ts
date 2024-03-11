import { EnvConfig } from '../../config/env'
import { RequiresAuth } from '../enums/requiresAuth.enum'

export function useAuthentication() {
	const isAuthenticated = (refreshToken = true): boolean => {
		const token = localStorage.getItem('user')?.split('|') ?? []
		let authenticated = false
		if (token.length === 3) {
			authenticated = parseInt(token[2]) > Date.now()
			if (!authenticated) {
				localStorage.removeItem('user')
			} else if (refreshToken) {
				token[2] = (
					Date.now() + EnvConfig.settings.session.duration
				).toString()
				localStorage.setItem('user', token.join('|'))
			}
		}

		return authenticated
	}

	const isAccessGranted = (requiresAuth: RequiresAuth) => {
		const authenticated = isAuthenticated(false)
		return (
			(!authenticated &&
				requiresAuth === RequiresAuth.NOT_AUTHENTICATED) ||
			(authenticated && requiresAuth === RequiresAuth.AUTHENTICATED) ||
			requiresAuth === RequiresAuth.BOTH
		)
	}

	return { isAccessGranted, isAuthenticated }
}
