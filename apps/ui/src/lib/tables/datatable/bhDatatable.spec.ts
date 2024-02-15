import { mount } from '@vue/test-utils'
import BhDatatable from './bhDatatable.vue'

describe('BhDatatable', () => {
	it('renders properly', () => {
		const wrapper = mount(BhDatatable, {})
		expect(wrapper.text()).toContain('Welcome to BhDatatable')
	})
})
