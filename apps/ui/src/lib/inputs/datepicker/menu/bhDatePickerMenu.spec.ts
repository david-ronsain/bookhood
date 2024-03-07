import { mount } from '@vue/test-utils'
import BhDatePickerMenu from './bhDatePickerMenu.vue'

describe('BhDatePickerMenu', () => {
	it('renders properly', () => {
		const wrapper = mount(BhDatePickerMenu, {
			props: { label: 'My datepicker' },
		})
		expect(wrapper.html()).toContain('My datepicker')
	})
})
