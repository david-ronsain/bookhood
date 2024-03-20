/* eslint-disable @nx/enforce-module-boundaries */
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import vuetify from '../../../src/plugins/vuetify'
import { VueWrapper, config, mount } from '@vue/test-utils'
import SendLinkForm from '../../../src/components/signin/sendLinkForm.vue'
import BhPrimaryButton from '../../../../ui/src/lib/buttons/primaryButton/bhPrimaryButton.vue'
import BhTextField from '../../../../ui/src/lib/inputs/textField/bhTextField.vue'
import { useMainStore, useUserStore } from '../../../src/store'

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

describe('Testing the component Search', () => {
	let wrapper: VueWrapper
	let userStore
	let mainStore

	beforeEach(() => {
		wrapper = mount(SendLinkForm, {
			attachTo: document.body,
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
			},
		})

		mainStore = useMainStore()
		userStore = useUserStore()
	})

	it('should mount the component', async () => {
		expect(wrapper.findComponent(SendLinkForm).exists()).toBe(true)
		expect(wrapper.findComponent(BhPrimaryButton).exists()).toBe(true)
		expect(wrapper.findComponent(BhTextField).exists()).toBe(true)

		expect(
			wrapper.findComponent(BhPrimaryButton).attributes('disabled'),
		).toBeDefined()
	})

	it('should not validate the form', async () => {
		await fillForm('test')

		expect(
			wrapper.findComponent(BhPrimaryButton).attributes('disabled'),
		).toBeDefined()
	})

	it('should validate the form', async () => {
		await fillForm()

		expect(
			wrapper.findComponent(BhPrimaryButton).attributes('disabled'),
		).toBeUndefined()
	})

	it('should succeed sending the link', async () => {
		await fillForm()

		userStore.sendSigninLink = () => Promise.resolve()
		vi.spyOn(userStore, 'sendSigninLink')

		wrapper.findComponent(BhPrimaryButton).trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(userStore.sendSigninLink).toHaveBeenCalledTimes(1)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		expect(mainStore.success.length).toBeGreaterThan(0)
	})

	it('should fail sending the link', async () => {
		await fillForm()

		userStore.sendSigninLink = () =>
			Promise.reject({ message: 'error', response: { status: 400 } })
		vi.spyOn(userStore, 'sendSigninLink')

		wrapper.findComponent(BhPrimaryButton).trigger('click')
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()

		expect(userStore.sendSigninLink).toHaveBeenCalledTimes(1)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		expect(mainStore.error.length).toBeGreaterThan(0)
	})

	const fillForm = async (email = 'test@email.com'): Promise<void> => {
		wrapper.findComponent(BhTextField).find('input').setValue(email)
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
		await wrapper.vm.$nextTick()
	}
})
