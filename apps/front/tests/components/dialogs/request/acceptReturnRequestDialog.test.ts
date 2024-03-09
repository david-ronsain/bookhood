import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import AcceptReturnRequestDialog from '../../../../src/components/dialogs/request/acceptReturnRequestDialog.vue'
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

describe('Testing the component AcceptReturnRequestDialog', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(AcceptReturnRequestDialog, {
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
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(AcceptReturnRequestDialog).exists()).toBe(
			true,
		)
		expect(
			wrapper.findComponent('.accept-return').attributes(),
		).toHaveProperty('disabled')
	})

	it('should open the dialog', async () => {
		wrapper.findComponent(AcceptReturnRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.accept-return').attributes(),
		).not.toHaveProperty('disabled')
	})

	it('should close the dialog', async () => {
		wrapper.findComponent(AcceptReturnRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.refuse-return').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.accept-return').attributes(),
		).toHaveProperty('disabled')
	})

	it('should accept the return', async () => {
		wrapper.findComponent(AcceptReturnRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.acceptReturn = () => Promise.resolve()

		wrapper.findComponent('.accept-return').trigger('click')
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail accepting the return', async () => {
		wrapper.findComponent(AcceptReturnRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.acceptReturn = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})

		wrapper.findComponent('.accept-return').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
