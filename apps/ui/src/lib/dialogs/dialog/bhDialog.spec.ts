import { mount } from '@vue/test-utils'
import BhDialog from './bhDialog.vue'

describe('BhDialog', () => {
	it('renders properly', () => {
		const wrapper = mount(BhDialog, {})
		expect(wrapper.text()).toContain('Welcome to BhDialog')
	})
})
