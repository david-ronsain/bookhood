import { mount } from '@vue/test-utils'
import BhCheckBox from './bhCheckBox.vue'

describe('BhCheckBox', () => {
	it('renders properly', () => {
		const wrapper = mount(BhCheckBox, { props: { label: 'My checkbox' } })
		expect(wrapper.html()).toContain('My checkbox')
	})
})
