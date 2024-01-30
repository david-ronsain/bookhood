import { mount } from '@vue/test-utils'
import BhPrimaryButton from './bhPrimaryButton.vue'

describe('Button', () => {
	it('renders properly', () => {
		const wrapper = mount(BhPrimaryButton, {
			props: { text: 'Submit button' },
		})
		expect(wrapper.html()).toContain('Submit button')
	})
})
