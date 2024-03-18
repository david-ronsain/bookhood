/* eslint-disable @nx/enforce-module-boundaries */
import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import MyBooks from '../../../../src/components/account/books/myBooks/myBooks.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { useAccountStore, useMainStore } from '../../../../src/store'
import { LibraryStatus } from '../../../../../shared/src'
import { VSelect } from 'vuetify/lib/components/index.mjs'
import { booksResults } from '../../../data/bookData'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

global.ResizeObserver = require('resize-observer-polyfill')

Object.defineProperty(global.navigator, 'mediaDevices', {
	value: {
		enumerateDevices: () => Promise.resolve([]),
	},
})

describe('Testing the component MyBooks', () => {
	let wrapper: VueWrapper
	let accountStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(MyBooks, {
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
			},
		})
		accountStore = useAccountStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(MyBooks)).toBeTruthy()
	})

	it('should show the empty list', async () => {
		expect(wrapper.find('.my-books-list').exists()).toBeTruthy()

		expect(
			wrapper.find('.my-books-list .v-data-table-rows-no-data').exists(),
		).toBeTruthy()
	})

	it('should list one book in the table', async () => {
		accountStore.books = booksResults.results
		await wrapper.vm.$nextTick()

		expect(
			wrapper.find('.my-books-list tbody tr').getRootNodes().length,
		).toBe(1)
	})

	it('should put the status in edit mode and quit it', async () => {
		accountStore.books = booksResults.results
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.my-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('dblclick')
		expect(accountStore.books[0].editing).toBe(true)

		await wrapper
			.find('.my-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()
		expect(accountStore.books[0].editing).toBe(false)
	})

	it('should enter edit mode and succeed to change status', async () => {
		accountStore.books = booksResults.results
		accountStore.updateBookStatus = () => Promise.resolve()
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.my-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.my-books-list tbody tr td:nth-of-type(4)')
			.findComponent(VSelect)
			.setValue(LibraryStatus.TO_GIVE)
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should enter edit mode and fail to change status', async () => {
		accountStore.books = booksResults.results
		accountStore.updateBookStatus = () => Promise.reject()
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.my-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.my-books-list tbody tr td:nth-of-type(4)')
			.findComponent(VSelect)
			.setValue(LibraryStatus.TO_GIVE)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.find('.my-books-list tbody tr td:nth-of-type(4)').html(),
		).contain(accountStore.books[0].status)

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
