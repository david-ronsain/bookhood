import { useText } from '../../src/composables/text.composable'
import { it, describe } from 'vitest'

describe('Testing the text composable', () => {
	describe('Testing the shorten method', () => {
		it('should leave the text as is', () => {
			expect(useText().shorten('text', 5)).toBe('text')
		})

		it('should return the shortened text', () => {
			expect(useText().shorten('text', 2)).toBe('...')
			expect(useText().shorten('longtext', 7)).toBe('long...')
		})
	})
})
