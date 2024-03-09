import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import CreateRequestDialog from '../../../../src/components/dialogs/request/createRequestDialog.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { BhDatePickerMenu } from '@bookhood/ui'
import { useMainStore, useRequestStore } from '../../../../src/store'

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

describe('Testing the component CreateRequestDialog', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(CreateRequestDialog, {
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
							'<div class="create-request-dialog"><slot /><slot name="actions"/></div>',
						props: { attach: true },
					},
					BhDatePickerMenu: {
						name: 'BhDatePickerMenu',
						template: '<div class="date-picker"><slot /></div>',
						emits: ['datesSelected'],
					},
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(CreateRequestDialog).exists()).toBe(true)
		expect(
			wrapper.findComponent('.create-request').attributes(),
		).toHaveProperty('disabled')
	})

	it('should process event datesSelected', async () => {
		wrapper.findComponent(CreateRequestDialog).vm.open({
			book: {
				libraryId: 'libId',
			},
		})
		await wrapper.vm.$nextTick()

		mainStore.profile = {}
		expect(
			wrapper
				.findComponent(BhDatePickerMenu)
				.vm.$emit('datesSelected', [new Date(), new Date()]),
		)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.create-request').attributes(),
		).not.toHaveProperty('disabled')
	})

	it('should create the request', async () => {
		wrapper.findComponent(CreateRequestDialog).vm.open({
			book: {
				libraryId: 'libId',
			},
		})
		mainStore.profile = {}
		expect(
			wrapper
				.findComponent(BhDatePickerMenu)
				.vm.$emit('datesSelected', [new Date(), new Date()]),
		)
		await wrapper.vm.$nextTick()

		requestStore.create = () => Promise.resolve()

		wrapper.findComponent('.create-request').trigger('click')
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail creating the request', async () => {
		wrapper.findComponent(CreateRequestDialog).vm.open({
			book: {
				libraryId: 'libId',
			},
		})
		mainStore.profile = {}
		expect(
			wrapper
				.findComponent(BhDatePickerMenu)
				.vm.$emit('datesSelected', [new Date(), new Date()]),
		)
		await wrapper.vm.$nextTick()

		requestStore.create = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})

		wrapper.findComponent('.create-request').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
