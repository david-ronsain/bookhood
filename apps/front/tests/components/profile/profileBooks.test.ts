import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import ProfileBooks from '../../../src/components/profile/profileBooks.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { BhDatatable } from '@bookhood/ui'
import { useProfileStore } from '../../../src/store'
import { booksResults } from '../../data/bookData'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

vi.mock('vue-router', () => ({
	useRoute: vi.fn().mockReturnValue({
		params: {
			userId: 'userId',
		},
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

global.ResizeObserver = require('resize-observer-polyfill')

describe('Testing the component ProfileBooks', () => {
	let wrapper: VueWrapper
	let profileStore

	beforeEach(() => {
		vi.clearAllMocks()
		wrapper = mount(ProfileBooks, {
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					BhDatatable: {
						name: 'BhDatatable',
						template: '<div class="books-datatable"><slot/></div>',
					},
				},
			},
		})

		profileStore = useProfileStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(ProfileBooks).exists()).toBe(true)
	})

	it('should change the table current page', async () => {
		wrapper.findComponent(BhDatatable).vm.$emit('update:page')
		await wrapper.vm.$nextTick()

		expect(profileStore.loadBooks).toHaveBeenCalledTimes(2)
	})

	it('should display one book', async () => {
		profileStore.booksList = booksResults.results
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.books-datatable tbody tr').text()).toContain(
			profileStore.booksList[0].title,
		)
	})

	it('should display the no data empty state', async () => {
		expect(
			wrapper.findComponent('.v-data-table-rows-no-data').exists(),
		).toBe(true)
	})
})
