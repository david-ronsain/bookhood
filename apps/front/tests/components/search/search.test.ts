/* eslint-disable @nx/enforce-module-boundaries */
import { VueWrapper, config, mount } from '@vue/test-utils'
import Search from '../../../src/components/search/search.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import SearchFields from '../../../src/components/search/searchFields.vue'
import SearchMap from '../../../src/components/search/searchMap.vue'
import CreateRequestDialog from '../../../src/components/dialogs/request/createRequestDialog.vue'
import SearchList from '../../../src/components/search/searchList.vue'
import { useBookStore } from '../../../src/store'
import { emptySearchResults, searchResults } from '../../data/bookData'
import { IBookSearch, IBookSearchResult } from '../../../../shared/src'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

vi.useFakeTimers()

describe('Testing the component Search', () => {
	let wrapper: VueWrapper
	let bookStore

	beforeEach(() => {
		wrapper = mount(Search, {
			attachTo: document.body,
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					SearchMap: {
						name: 'SearchMap',
						template: '<div class="search-map"><slot/></div>',
						emits: ['search', 'book:picked', 'map:ready'],
						expose: [
							'removeMarkers',
							'getBoundingBox',
							'setMarkers',
							'setCenter',
							'pickedBook',
							'pickMarker',
							'highlightMarker',
							'unhighlightMarkers',
						],
						methods: {
							removeMarkers: vi.fn(),
							setMarkers: vi.fn(),
							setCenter: vi.fn(),
							pickMarker: vi.fn(),
							highlightMarker: vi.fn(),
							unhighlightMarkers: vi.fn(),
							getBoundingBox: vi
								.fn()
								.mockReturnValue([0, 0, 0, 0]),
						},
					},
					SearchList: {
						name: 'SearchList',
						template: '<div class="search-list"><slot/></div>',
						emits: [
							'click:marker',
							'mouseover:marker',
							'mouseout:marker',
							'click:borrow',
						],
						props: {
							books: {
								default: [],
								type: Array<IBookSearchResult>,
							},
							pickedBook: {
								default: [],
								type: Array<string>,
							},
						},
					},
					CreateRequestDialog: {
						name: 'CreateRequestDialog',
						template:
							'<div class="create-request-dialog"><slot/></div>',
						methods: {
							open: vi.fn(),
						},
						expose: ['open'],
					},
					SearchFields: {
						name: 'SearchFields',
						template: '<div class="search-fields"><slot /></div>',
						emits: ['center:changed', 'reset', 'search'],
						expose: ['form', 'resetPage'],
						methods: {
							resetPage: vi.fn(),
						},
						data() {
							return {
								form: { page: 0 },
							}
						},
					},
				},
			},
		})

		bookStore = useBookStore()
	})

	it('should mount the component', async () => {
		await search(emptySearchResults)

		vi.spyOn(bookStore, 'searchByName')

		expect(wrapper.findComponent(Search).exists()).toBe(true)
		expect(wrapper.findComponent(SearchFields).exists()).toBe(true)
		expect(wrapper.findComponent(SearchMap).exists()).toBe(true)
		expect(wrapper.findComponent(CreateRequestDialog).exists()).toBe(true)

		expect(bookStore.searchByName).not.toHaveBeenCalled()

		vi.spyOn(bookStore, 'searchByName').mockImplementationOnce(() => {
			return {
				data: searchResults,
			}
		})

		wrapper.findComponent(SearchMap).vm.$emit('map:ready')
		vi.advanceTimersByTime(3000)
		await wrapper.vm.$nextTick()

		expect(bookStore.searchByName).toHaveBeenCalledTimes(1)
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(SearchList).exists()).toBe(true)
	})

	it('should display the empty state', async () => {
		await search(emptySearchResults)

		expect(wrapper.findComponent(Search).text()).toContain(
			'search.noResult',
		)
	})

	it('should display the list', async () => {
		await search(searchResults)

		expect(wrapper.findComponent(SearchList).exists()).toBe(true)
	})

	it('should receive a center:changed event from the search fields', async () => {
		await search(emptySearchResults)

		const spy = vi.spyOn(wrapper.findComponent(SearchMap).vm, 'setCenter')

		wrapper.findComponent(SearchFields).vm.$emit('center:changed', [0, 0])
		await wrapper.vm.$nextTick()

		expect(spy.mock.calls.length).toBe(1)
	})

	it('should receive a reset event from the search fields', async () => {
		await search(emptySearchResults)

		const spy = vi.spyOn(
			wrapper.findComponent(SearchFields).vm,
			'resetPage',
		)

		wrapper.findComponent(SearchFields).vm.$emit('reset')
		await wrapper.vm.$nextTick()

		expect(spy.mock.calls.length).toBe(1)
	})

	it('should receive a search event from the search fields', async () => {
		await search(emptySearchResults)

		vi.spyOn(bookStore, 'searchByName')

		wrapper.findComponent(SearchFields).vm.$emit('search')
		vi.advanceTimersByTime(3000)
		await wrapper.vm.$nextTick()
		vi.advanceTimersByTime(3000)

		expect(bookStore.searchByName).toHaveBeenCalledTimes(1)
	})

	it('should receive a search event from the search map', async () => {
		await search(emptySearchResults)

		vi.spyOn(bookStore, 'searchByName')

		wrapper.findComponent(SearchFields).vm.$emit('search')
		vi.advanceTimersByTime(3000)
		await wrapper.vm.$nextTick()
		vi.advanceTimersByTime(3000)

		expect(bookStore.searchByName).toHaveBeenCalledTimes(1)
	})

	it('should receive a book:picked event from the search map', async () => {
		await search(searchResults)

		vi.spyOn(bookStore, 'searchByName')

		wrapper
			.findComponent(SearchMap)
			.vm.$emit('book:picked', [searchResults.results[0]._id])
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(Search).vm.pickedBook).toMatchObject([
			searchResults.results[0]._id,
		])
	})

	it('should receive a click:marker event from the search list', async () => {
		await search(searchResults)

		vi.spyOn(wrapper.findComponent(SearchMap).vm, 'pickMarker')

		wrapper
			.findComponent(SearchList)
			.vm.$emit('click:marker', [searchResults.results[0]._id])
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchMap).vm.pickMarker,
		).toHaveBeenCalledTimes(1)
	})

	it('should receive a mouseover:marker event from the search list', async () => {
		await search(searchResults)

		vi.spyOn(wrapper.findComponent(SearchMap).vm, 'highlightMarker')

		wrapper
			.findComponent(SearchList)
			.vm.$emit('mouseover:marker', searchResults.results[0])
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchMap).vm.highlightMarker,
		).toHaveBeenCalledTimes(1)
	})

	it('should receive a mouseout:marker event from the search list', async () => {
		await search(searchResults)

		vi.spyOn(wrapper.findComponent(SearchMap).vm, 'unhighlightMarkers')

		wrapper.findComponent(SearchList).vm.$emit('mouseout:marker')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchMap).vm.unhighlightMarkers,
		).toHaveBeenCalledTimes(1)
	})

	it('should receive a click:borrow event from the search list and should open the dialog', async () => {
		await search(searchResults)

		vi.spyOn(wrapper.findComponent(SearchMap).vm, 'pickMarker')
		vi.spyOn(wrapper.findComponent(CreateRequestDialog).vm, 'open')

		wrapper
			.findComponent(SearchList)
			.vm.$emit('click:borrow', searchResults.results[0]._id)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchMap).vm.pickMarker,
		).toHaveBeenCalledTimes(1)
		expect(
			wrapper.findComponent(CreateRequestDialog).vm.open,
		).toHaveBeenCalledTimes(1)
	})

	const search = async (results: IBookSearch): Promise<void> => {
		bookStore.searchByName = vi.fn().mockImplementation(() =>
			Promise.resolve({
				data: results,
			}),
		)

		wrapper.findComponent(SearchMap).vm.$emit('map:ready')
		vi.advanceTimersByTime(3000)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
	}
})
