import { mount } from '@vue/test-utils'
import BhTextField from './bhTextField.vue'

describe('BhTextField', () => {
	it('renders properly', () => {
		const wrapper = mount(BhTextField, { props: { label: 'field' } })
		expect(wrapper.text()).toContain('Welcome to BhTextField')
	})
})
