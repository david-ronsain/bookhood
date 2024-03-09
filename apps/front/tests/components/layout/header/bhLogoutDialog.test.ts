import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import BhLogoutDialog from '../../../../src/components/layout/header/BhLogoutDialog.vue'
import { useRouter } from 'vue-router'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

vi.mock('vue-router')

config.global.mocks = {
	$t: (tKey) => tKey,
}

global.ResizeObserver = require('resize-observer-polyfill')

describe('Testing the component BhLogoutDialog', () => {
	let wrapper: VueWrapper
	vi.mocked(useRouter).mockReturnValue({
		...useRouter(),
		push: vi.fn(),
	})

	beforeEach(() => {
		wrapper = mount(BhLogoutDialog, {
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
							'<div class="logout-dialog"><slot /><slot name="actions"/></div>',
						props: { attach: true },
					},
				},
			},
		})
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(BhLogoutDialog).exists()).toBe(true)
	})

	it('should remove the user from the localStorage', async () => {
		localStorage.setItem('user', '')

		wrapper.findComponent('.confirm-logout').trigger('click')
		await wrapper.vm.$nextTick()

		expect(localStorage.getItem('user')).toBeNull()

		expect(useRouter().push).toHaveBeenCalledWith({ name: 'logout' })
	})

	it('should not remove the user from the localStorage', async () => {
		localStorage.setItem('user', '')

		wrapper.findComponent('.cancel-logout').trigger('click')
		await wrapper.vm.$nextTick()

		expect(localStorage.getItem('user')).toBe('')
	})
})
