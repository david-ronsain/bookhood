import { RouterLinkStub, VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import SearchList from '../../../src/components/search/searchList.vue'
import vuetify from '../../../src/plugins/vuetify'
import { searchResults } from '../../data/searchData'
import { useText } from '../../../src/composables/text.composable'
import { createTestingPinia } from '@pinia/testing'
import { VListItem } from 'vuetify/lib/components/index.mjs'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

vi.mock('../../../src/composables/text.composable')

config.global.mocks = {
	$t: (tKey) => tKey,
}

describe('Testing the component SearchList', () => {
	let wrapper: VueWrapper

	vi.mocked(useText).mockReturnValue({
		shorten: vi.fn(),
	})

	beforeEach(() => {
		wrapper = mount(SearchList, {
			attachTo: document.body,
			props: {
				books: [],
				pickedBook: [],
			},
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					VListItem: {
						name: 'VListItem',
						template: '<div class="search-result-item"></div>',
						emits: ['click', 'mouseover', 'mouseout'],
					},
					RouterLink: RouterLinkStub,
				},
			},
		})
	})

	it('should mount the component', async () => {
		expect(wrapper.findComponent(SearchList).exists()).toBe(true)
	})

	it('should display the books', async () => {
		await wrapper.setProps({
			books: searchResults.results,
			pickedBook: [searchResults.results[0]._id as string],
		})

		expect(wrapper.findAllComponents(VListItem).length).toBe(
			searchResults.total,
		)
	})

	it('should catch the click:marker event', async () => {
		await wrapper.setProps({
			books: searchResults.results,
			pickedBook: [searchResults.results[0]._id as string],
		})

		wrapper.findComponent(VListItem).vm.$emit('click')

		expect(wrapper.emitted('click:marker')).toBeDefined()
	})

	it('should catch the mouseover:marker event', async () => {
		await wrapper.setProps({
			books: searchResults.results,
			pickedBook: [searchResults.results[0]._id as string],
		})

		wrapper.findComponent(VListItem).vm.$emit('mouseover')

		expect(wrapper.emitted('mouseover:marker')).toBeDefined()
	})

	it('should catch the mouseout:marker event', async () => {
		await wrapper.setProps({
			books: searchResults.results,
			pickedBook: [searchResults.results[0]._id as string],
		})

		wrapper.findComponent(VListItem).vm.$emit('mouseout')

		expect(wrapper.emitted('mouseout:marker')).toBeDefined()
	})
})
