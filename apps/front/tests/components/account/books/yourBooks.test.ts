import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import YourBooks from '../../../../src/components/account/books/yourBooks/yourBooks.vue'
import CreateBookDialog from '../../../../src/components/dialogs/request/createRequestDialog.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { h } from 'vue'
import { VApp } from 'vuetify/components'
import { useAccountStore, useMainStore } from '../../../../src/store'
import { LibraryStatus } from '../../../../../shared/src'

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

describe('Testing the component YourBooks', () => {
	let wrapper: VueWrapper
	let accountStore
	let mainStore
	const books = [
		{
			_id: 'bookId',
			title: 'title',
			authors: ['author'],
			description: 'desc',
			place: 'place',
			status: LibraryStatus.TO_LEND,
			categories: ['category'],
		},
	]

	beforeEach(() => {
		wrapper = mount(VApp, {
			slots: {
				default: h(YourBooks),
			},
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					VDialog: {
						name: 'VDialog',
						template: '<div class="v-dialog-stub"><slot /></div>',
					},
				},
			},
		})
		accountStore = useAccountStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent({ name: 'YourBooks' })).toBeTruthy()
	})

	it('should show the button to add a book', async () => {
		expect(wrapper.find('.add-book').exists).toBeTruthy()
		await wrapper.find('.add-book').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('click')

		expect(wrapper.find('.your-books-list').exists()).toBeTruthy()

		expect(
			wrapper
				.find('.your-books-list .v-data-table-rows-no-data')
				.exists(),
		).toBeTruthy()
	})

	it('should list one book in the table', async () => {
		accountStore.books = books
		await wrapper.vm.$nextTick()

		expect(
			wrapper.find('.your-books-list tbody tr').getRootNodes().length,
		).toBe(1)
	})

	it('should put the status in edit mode and quit it', async () => {
		accountStore.books = books
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.your-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('dblclick')
		expect(accountStore.books[0].editing).toBe(true)

		await wrapper
			.find('.your-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()
		expect(accountStore.books[0].editing).toBe(false)
	})

	it('should enter edit mode and succeed to change status', async () => {
		accountStore.books = books
		accountStore.updateBookStatus = () => Promise.resolve()
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.your-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.your-books-list tbody tr td:nth-of-type(4)')
			.findComponent({ name: 'VSelect' })
			.setValue(LibraryStatus.TO_GIVE)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.find('.your-books-list tbody tr td:nth-of-type(4)').html(),
		).contain(LibraryStatus.TO_GIVE)

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should enter edit mode and fail to change status', async () => {
		accountStore.books = books
		accountStore.updateBookStatus = () => Promise.reject()
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.your-books-list tbody tr td:nth-of-type(4)')
			.trigger('dblclick')
		await wrapper.vm.$nextTick()

		await wrapper
			.find('.your-books-list tbody tr td:nth-of-type(4)')
			.findComponent({ name: 'VSelect' })
			.setValue(LibraryStatus.TO_GIVE)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.find('.your-books-list tbody tr td:nth-of-type(4)').html(),
		).contain(books[0].status)

		expect(mainStore.error.length).toBeGreaterThan(0)
	})

	it('should reload the list if a book has been created', async () => {
		accountStore.books = books
		accountStore.updateBookStatus = () => Promise.reject()
		await wrapper.vm.$nextTick()

		await wrapper.find('.add-book').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper
				.findComponent({
					name: 'VDialog',
				})
				.exists(),
		).toBe(true)
	})
})
