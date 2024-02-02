import { mount } from '@vue/test-utils'
import BhCard from './bhCard.vue'

describe('BhCard', () => {
	it('renders properly', () => {
		const wrapper = mount(BhCard, {})
		expect(wrapper.text()).toContain('Welcome to BhCard')
	})
})
