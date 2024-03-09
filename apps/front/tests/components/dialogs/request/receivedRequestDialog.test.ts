import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import ReceivedRequestDialog from '../../../../src/components/dialogs/request/receivedRequestDialog.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
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

describe('Testing the component ReceivedRequestDialog', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(ReceivedRequestDialog, {
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
							'<div class="received-request-dialog"><slot /><slot name="actions"/></div>',
						props: { attach: true },
					},
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(ReceivedRequestDialog).exists()).toBe(true)
		expect(
			wrapper.findComponent('.confirm-received').attributes(),
		).toHaveProperty('disabled')
	})

	it('should open the dialog', async () => {
		wrapper.findComponent(ReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.confirm-received').attributes(),
		).not.toHaveProperty('disabled')
	})

	it('should close the dialog', async () => {
		wrapper.findComponent(ReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.cancel-received').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.confirm-received').attributes(),
		).toHaveProperty('disabled')
	})

	it('should flag the request as received', async () => {
		wrapper.findComponent(ReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.received = () => Promise.resolve()

		wrapper.findComponent('.confirm-received').trigger('click')
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail flagging the request as received', async () => {
		wrapper.findComponent(ReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.received = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})

		wrapper.findComponent('.confirm-received').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
