import { mount } from '@vue/test-utils'
import BhSnackbarSuccess from './bhSnackbarSuccess.vue'

describe('BhSnackbarError', () => {
	it('renders properly', () => {
		const wrapper = mount(BhSnackbarSuccess, {
			props: { text: 'Success', opened: true },
		})
		//expect(wrapper.html()).toContain('Success')
	})
})
