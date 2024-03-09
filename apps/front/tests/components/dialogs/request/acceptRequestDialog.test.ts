import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import AcceptRequestDialog from '../../../../src/components/dialogs/request/acceptRequestDialog.vue'
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

describe('Testing the component AcceptRequestDialog', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(AcceptRequestDialog, {
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
							'<div class="accept-request-dialog"><slot /><slot name="actions"/></div>',
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
		expect(wrapper.findComponent(AcceptRequestDialog).exists()).toBe(true)
		expect(
			wrapper.findComponent('.accept-request').attributes(),
		).toHaveProperty('disabled')
	})

	it('should process event selectDate', async () => {
		expect(
			wrapper
				.findComponent(BhDatePickerMenu)
				.vm.$emit('datesSelected', [new Date(), new Date()]),
		)
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.accept-request').attributes(),
		).toHaveProperty('disabled')
	})

	it('should open the dialog and fill data without selected dates', async () => {
		wrapper
			.findComponent(AcceptRequestDialog)
			.vm.open('requestId', '2024-04-01', '2024-03-01')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.accept-request').attributes(),
		).toHaveProperty('disabled')
	})

	it('should open the dialog and fill data and select dates', async () => {
		wrapper
			.findComponent(AcceptRequestDialog)
			.vm.open('requestId', '2024-03-01', '2024-04-01')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.accept-request').attributes(),
		).not.toHaveProperty('disabled')
	})

	it('should close the dialog', async () => {
		wrapper
			.findComponent(AcceptRequestDialog)
			.vm.open('requestId', '2024-03-01', '2024-04-01')
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.not-accept-request').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.accept-request').attributes(),
		).toHaveProperty('disabled')
	})

	it('should accept the request', async () => {
		wrapper
			.findComponent(AcceptRequestDialog)
			.vm.open('requestId', '2024-03-01', '2024-04-01')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.accept = () => Promise.resolve()

		wrapper.findComponent('.accept-request').trigger('click')
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail accepting the request', async () => {
		wrapper
			.findComponent(AcceptRequestDialog)
			.vm.open('requestId', '2024-03-01', '2024-04-01')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.accept = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})

		wrapper.findComponent('.accept-request').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
