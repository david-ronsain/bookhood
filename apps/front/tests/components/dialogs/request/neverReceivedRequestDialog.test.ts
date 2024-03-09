import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import NeverReceivedRequestDialog from '../../../../src/components/dialogs/request/neverReceivedRequestDialog.vue'
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

describe('Testing the component NeverReceivedRequestDialog', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(NeverReceivedRequestDialog, {
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
							'<div class="never-received-request-dialog"><slot /><slot name="actions"/></div>',
						props: { attach: true },
					},
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(NeverReceivedRequestDialog).exists()).toBe(
			true,
		)
		expect(
			wrapper.findComponent('.never-received').attributes(),
		).toHaveProperty('disabled')
	})

	it('should open the dialog', async () => {
		wrapper.findComponent(NeverReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.never-received').attributes(),
		).not.toHaveProperty('disabled')
	})

	it('should close the dialog', async () => {
		wrapper.findComponent(NeverReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.cancel-never-received').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.never-received').attributes(),
		).toHaveProperty('disabled')
	})

	it('should flag the request as never received', async () => {
		wrapper.findComponent(NeverReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.neverReceived = () => Promise.resolve()

		wrapper.findComponent('.never-received').trigger('click')
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail flagging the request as never received', async () => {
		wrapper.findComponent(NeverReceivedRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.neverReceived = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})

		wrapper.findComponent('.never-received').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
