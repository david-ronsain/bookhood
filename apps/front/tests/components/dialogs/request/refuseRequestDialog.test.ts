import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import RefuseRequestDialog from '../../../../src/components/dialogs/request/refuseRequestDialog.vue'
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

describe('Testing the component RefuseRequestDialog', () => {
	let wrapper: VueWrapper
	let requestStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(RefuseRequestDialog, {
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
							'<div class="refuse-request-dialog"><slot /><slot name="actions"/></div>',
						props: { attach: true },
					},
				},
			},
		})

		requestStore = useRequestStore()
		mainStore = useMainStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(RefuseRequestDialog).exists()).toBe(true)
		expect(
			wrapper.findComponent('.confirm-refuse').attributes(),
		).toHaveProperty('disabled')
	})

	it('should open the dialog', async () => {
		wrapper.findComponent(RefuseRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.confirm-refuse').attributes(),
		).not.toHaveProperty('disabled')
	})

	it('should close the dialog', async () => {
		wrapper.findComponent(RefuseRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		wrapper.findComponent('.cancel-refuse').trigger('click')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent('.confirm-refuse').attributes(),
		).toHaveProperty('disabled')
	})

	it('should flag the request as refused', async () => {
		wrapper.findComponent(RefuseRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.refuse = () => Promise.resolve()

		wrapper.findComponent('.confirm-refuse').trigger('click')
		await wrapper.vm.$nextTick()

		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail flagging the request as received', async () => {
		wrapper.findComponent(RefuseRequestDialog).vm.open('requestId')
		await wrapper.vm.$nextTick()

		mainStore.profile = {
			_id: 'userId',
		}
		requestStore.refuse = () =>
			Promise.reject({
				response: {
					data: {
						message: 'message',
					},
				},
			})

		wrapper.findComponent('.confirm-refuse').trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(mainStore.error.length).toBeGreaterThan(0)
	})
})
