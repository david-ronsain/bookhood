import { mount } from '@vue/test-utils'
import BhSnackbarError from './bhSnackbarError.vue'

describe('BhSnackbarError', () => {
	it('renders properly', () => {
		const wrapper = mount(BhSnackbarError, {
			text: 'submit',
		})
		expect(wrapper.text()).toContain('submit')
	})
})
