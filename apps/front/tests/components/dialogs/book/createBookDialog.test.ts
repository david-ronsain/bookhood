/* eslint-disable @nx/enforce-module-boundaries */
import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import CreateBookDialog from '../../../../src/components/dialogs/book/createBookDialog.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { useBookStore, useMainStore } from '../../../../src/store'
import { IBook, LibraryStatus } from '../../../../../shared/src'
import { BhAddressAutocomplete, BhTextField } from '@bookhood/ui'
import { bookToAdd } from '../../../data/bookData'

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

vi.useFakeTimers()

describe('Testing the component CreateBookDialog', () => {
	let wrapper: VueWrapper
	let bookStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(CreateBookDialog, {
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					BhDialog: {
						name: 'BhDialog',
						template:
							'<div class="add-book" ref="addDialog"><slot /><slot name="actions"/></div>',
						props: { attach: true },
					},
					StreamBarcodeReader: {
						name: 'StreamBarcodeReader',
						template: '<div class="badcode-reader"></div>',
					},
					BhAddressAutocomplete: {
						name: 'BhAddressAutocomplete',
						template:
							'<div class="address-autocomplete-stub"></div>',
						emits: ['place:updated', 'center:updated'],
					},
					BhTextField: {
						name: 'BhTextField',
						template: '<div class="isbn-search-stub"></div>',
						emits: [
							'click:append',
							'blur',
							'click:clear',
							'update:modelValue',
						],
					},
				},
			},
		})

		bookStore = useBookStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(CreateBookDialog).exists()).toBe(true)
		expect(wrapper.find('.create-book').attributes()).toHaveProperty(
			'disabled',
		)
	})

	it('should create the book', async () => {
		await completeForm()

		bookStore.add = () => Promise.resolve()

		wrapper.find('.create-book').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail adding the book', async () => {
		await completeForm()

		bookStore.add = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})
		wrapper.find('.create-book').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		expect(mainStore.error.length).toBeGreaterThan(0)
	})

	it('should reset the isbn search', async () => {
		await completeForm()

		wrapper.findComponent(BhTextField).vm.$emit('click:clear')
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.book-article').exists()).toBe(false)
		expect(wrapper.find('.create-book').attributes()).toHaveProperty(
			'disabled',
		)
	})

	const completeForm = async () => {
		bookStore.searchGoogleByISBN = (): IBook => bookToAdd

		wrapper.findComponent(BhTextField).vm.$emit('update:modelValue', '0000')
		vi.advanceTimersByTime(3000)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.book-article').exists()).toBe(true)

		wrapper
			.find(`.book-status input[value=${LibraryStatus.TO_LEND}]`)
			.trigger('click')
		await wrapper.vm.$nextTick()

		wrapper
			.findComponent(BhAddressAutocomplete)
			.vm.$emit('place:updated', [0, 0])
		wrapper
			.findComponent(BhAddressAutocomplete)
			.vm.$emit('center:updated', [0, 0])
		await wrapper.vm.$nextTick()

		expect(wrapper.find('.create-book').attributes()).not.toHaveProperty(
			'disabled',
		)
	}
})
