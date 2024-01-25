import { mount } from '@vue/test-utils'
import BhCheckBpx from './bhCheckBox.vue'

describe('BhCheckBox', () => {
	it('renders properly', () => {
		const wrapper = mount(BhCheckBpx, {})
		expect(wrapper.text()).toContain('Welcome to BhCheckBpx')
	})
})
