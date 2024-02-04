import { mount } from '@vue/test-utils'
import BhAddressAutocomplete from './bhAddressAutocomplete.vue'

describe('BhAddressAutocomplete', () => {
	it('renders properly', () => {
		const wrapper = mount(BhAddressAutocomplete, {})
		expect(wrapper.text()).toContain('Welcome to BhAddressAutocomplete')
	})
})
