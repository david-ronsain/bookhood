import { mount } from '@vue/test-utils'
import BhDatePickerMenu from './bhDatePickerMenu.vue'

describe('BhDatePickerMenu', () => {
	it('renders properly', () => {
		const wrapper = mount(BhDatePickerMenu, {
			props: { locales: { dateLabel: 'Du {date1} au {date2}' } },
		})
		expect(wrapper.html()).toContain('My datepicker')
	})
})
