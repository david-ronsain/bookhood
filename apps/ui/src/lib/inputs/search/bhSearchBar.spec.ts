import { mount } from '@vue/test-utils'
import BhSearchBar from './bhSearchBar.vue'

describe('BhSearchBar', () => {
	it('renders properly', () => {
		const wrapper = mount(BhSearchBar, {
			props: { placeholder: 'My Searchbar' },
		})
		expect(wrapper.html()).toContain('My Searchbar')
	})
})
