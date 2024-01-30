import { mount } from '@vue/test-utils'
import BhTextField from './bhTextField.vue'

describe('BhTextField', () => {
	it('renders properly', () => {
		const wrapper = mount(BhTextField, { props: { label: 'My textfield' } })
		expect(wrapper.html()).toContain('My textfield')
	})
})
