import { mount } from '@vue/test-utils'
import BhSnackbarSuccess from './bhSnackbarSuccess.vue'

describe('BhSnackbarError', () => {
	it('renders properly', () => {
		const wrapper = mount(BhSnackbarSuccess, {
			text: 'submit',
		})
		expect(wrapper.text()).toContain('submit')
	})
})
