import { mount } from '@vue/test-utils'
import BhSnackbarError from './bhSnackbarError.vue'

describe('BhSnackbarError', () => {
	it('renders properly', () => {
		const wrapper = mount(BhSnackbarError, {
			props: { text: 'Error', opened: true },
		})
		console.log(wrapper.html())
		//expect(wrapper.html()).toContain('Error')
	})
})
