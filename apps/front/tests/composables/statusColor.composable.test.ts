/* eslint-disable @nx/enforce-module-boundaries */
import { LibraryStatus, RequestStatus } from '../../../shared/src'
import { useStatusColor } from '../../src/composables/statusColor.composable'
import { it, describe } from 'vitest'

describe('Testing the status color composable', () => {
	describe('Testing the request colors', () => {
		it('should return the color for PENDING_VALIDATION', () => {
			expect(
				useStatusColor().request(RequestStatus.PENDING_VALIDATION),
			).toBe('purple-lighten-3')
		})

		it('should return the color for ACCEPTED_PENDING_DELIVERY', () => {
			expect(
				useStatusColor().request(
					RequestStatus.ACCEPTED_PENDING_DELIVERY,
				),
			).toBe('pink-lighten-3')
		})

		it('should return the color for REFUSED', () => {
			expect(useStatusColor().request(RequestStatus.REFUSED)).toBe(
				'indigo-lighten-3',
			)
		})

		it('should return the color for RECEIVED', () => {
			expect(useStatusColor().request(RequestStatus.RECEIVED)).toBe(
				'blue-lighten-3',
			)
		})

		it('should return the color for NEVER_RECEIVED', () => {
			expect(useStatusColor().request(RequestStatus.NEVER_RECEIVED)).toBe(
				'cyan-lighten-3',
			)
		})

		it('should return the color for RETURN_PENDING', () => {
			expect(useStatusColor().request(RequestStatus.RETURN_PENDING)).toBe(
				'teal-lighten-3',
			)
		})

		it('should return the color for RETURN_ACCEPTED', () => {
			expect(
				useStatusColor().request(RequestStatus.RETURN_ACCEPTED),
			).toBe('green-lighten-3')
		})

		it('should return the color for RETURNED_WITH_ISSUE', () => {
			expect(
				useStatusColor().request(RequestStatus.RETURNED_WITH_ISSUE),
			).toBe('red-lighten-3')
		})

		it('should return the color for ISSUE_FIXED', () => {
			expect(useStatusColor().request(RequestStatus.ISSUE_FIXED)).toBe(
				'amber-lighten-3',
			)
		})
	})

	describe('Testing the library colors', () => {
		it('should return the color for TO_GIVE', () => {
			expect(useStatusColor().library(LibraryStatus.TO_GIVE)).toBe(
				'purple-lighten-3',
			)
		})

		it('should return the color for TO_LEND', () => {
			expect(useStatusColor().library(LibraryStatus.TO_LEND)).toBe(
				'red-lighten-3',
			)
		})
	})
})
