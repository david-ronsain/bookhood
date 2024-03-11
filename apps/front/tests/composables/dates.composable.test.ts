import { useFormatDates } from '../../src/composables/dates.composable'
import { it, describe } from 'vitest'

const useDate = () => ({
	format: (date: string) => date.split('-').reverse().join('/'),
})

describe('Testing the dates composable', () => {
	it('should return the formatted dates', () => {
		const res = useFormatDates().displayKeyboardDates(
			useDate(),
			'2024-03-10',
			'2024-03-17',
		)
		expect(res).toBe('10/03/2024 - 17/03/2024')
	})
})
