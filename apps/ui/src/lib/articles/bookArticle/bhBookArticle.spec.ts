import { mount } from '@vue/test-utils'
import BhBookArticle from './bhBookArticle.vue'

describe('BhBookArticle', () => {
	it('renders properly', () => {
		const wrapper = mount(BhBookArticle, {})
		expect(wrapper.text()).toContain('Welcome to BhBookArticle')
	})
})
