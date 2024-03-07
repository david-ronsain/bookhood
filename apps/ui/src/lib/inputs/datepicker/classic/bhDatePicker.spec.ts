import { mount } from '@vue/test-utils'
import BhDatePicker from './bhDatePicker.vue'

describe('BhDatePicker', () => {
	it('renders properly', () => {
		const wrapper = mount(BhDatePicker, {
			props: { label: 'My datepicker' },
		})
		expect(wrapper.html()).toContain('My datepicker')
	})
})
