import { mount } from '@vue/test-utils'
import FloatingButton from './floatingButton.vue'

describe('FloatingButton', () => {
	it('renders properly', () => {
		const wrapper = mount(FloatingButton, {})
		expect(wrapper.text()).toContain('Welcome to FloatingButton')
	})
})
