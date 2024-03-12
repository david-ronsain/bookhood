import { describe } from 'vitest'
import { useAuthentication } from '../../src/composables/authentication.composable'
import { RequiresAuth } from '../../src/enums/requiresAuth.enum'
import { EnvConfig } from '../../config/env'

describe('Testing the authentication composable', () => {
	describe('Testing the isAuthenticated method', () => {
		it('should return false because the token is incorrectly formatted', () => {
			localStorage.setItem(EnvConfig.localStorage.userKey, '')
			expect(useAuthentication().isAuthenticated()).toBe(false)
		})

		it('should return false becase the token has expired', () => {
			localStorage.setItem(
				EnvConfig.localStorage.userKey,
				`||${Date.now() - 1}`,
			)
			expect(useAuthentication().isAuthenticated()).toBe(false)
			expect(
				localStorage.getItem(EnvConfig.localStorage.userKey),
			).toBeNull()
		})

		it('should return true and renew the token', () => {
			const token = `||${Date.now() * 1000}`
			localStorage.setItem(EnvConfig.localStorage.userKey, token)

			expect(useAuthentication().isAuthenticated()).toBe(true)
			expect(
				localStorage.getItem(EnvConfig.localStorage.userKey),
			).not.toBe(token)
		})

		it('should return true and leave the token as is', () => {
			const token = `||${Date.now() * 1000}`
			localStorage.setItem(EnvConfig.localStorage.userKey, token)

			expect(useAuthentication().isAuthenticated(false)).toBe(true)
			expect(localStorage.getItem(EnvConfig.localStorage.userKey)).toBe(
				token,
			)
		})
	})

	describe('Testing the isAccessGrantedMethod', () => {
		it('should return true if the access is granted to everyone', () => {
			expect(useAuthentication().isAccessGranted(RequiresAuth.BOTH)).toBe(
				true,
			)
		})

		it('should return false if the access is granted only to authenticated user and the token is incorrect', () => {
			localStorage.setItem(
				EnvConfig.localStorage.userKey,
				`||${Date.now() - 1}`,
			)
			expect(
				useAuthentication().isAccessGranted(RequiresAuth.AUTHENTICATED),
			).toBe(false)
		})

		it('should return true if the access is granted only to authenticated user and the token is correct', () => {
			localStorage.setItem(
				EnvConfig.localStorage.userKey,
				`||${Date.now() * 1000}`,
			)
			expect(
				useAuthentication().isAccessGranted(RequiresAuth.AUTHENTICATED),
			).toBe(true)
		})

		it('should return true if the access is granted only to non authenticated user and the token is incorrect', () => {
			localStorage.setItem(
				EnvConfig.localStorage.userKey,
				`||${Date.now() - 1}`,
			)
			expect(
				useAuthentication().isAccessGranted(
					RequiresAuth.NOT_AUTHENTICATED,
				),
			).toBe(true)
		})

		it('should return false if the access is granted only to non authenticated user and the token is correct', () => {
			localStorage.setItem(
				EnvConfig.localStorage.userKey,
				`||${Date.now() * 1000}`,
			)
			expect(
				useAuthentication().isAccessGranted(
					RequiresAuth.NOT_AUTHENTICATED,
				),
			).toBe(false)
		})
	})

	afterAll(() => {
		localStorage.removeItem(EnvConfig.localStorage.userKey)
	})
})
