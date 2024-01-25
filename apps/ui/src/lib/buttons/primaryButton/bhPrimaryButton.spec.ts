import { mount } from '@vue/test-utils'
import BhPrimaryButton from './bhPrimaryButton.vue'

describe('Button', () => {
	it('renders properly', () => {
		const wrapper = mount(BhPrimaryButton, { text: 'Submit' })
		expect(wrapper.text()).toContain('Submit')
	})
})
