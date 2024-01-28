import { mount } from '@vue/test-utils'
import BhSearchBar from './bhSearchBar.vue'

describe('BhSearchBar', () => {
	it('renders properly', () => {
		const wrapper = mount(BhSearchBar, {})
		expect(wrapper.text()).toContain('Welcome to BhSearchBar')
	})
})
