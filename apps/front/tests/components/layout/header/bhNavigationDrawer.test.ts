import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import BhNavigationDrawer from '../../../../src/components/layout/header/BhNavigationDrawer.vue'
import { useMainStore } from '../../../../src/store'
import { VApp } from 'vuetify/lib/components/index.mjs'
import { h } from 'vue'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

vi.mock('vue-router', () => ({
	useRoute: vi.fn().mockReturnValue({
		name: '',
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

global.ResizeObserver = require('resize-observer-polyfill')

describe('Testing the component BhNavigationDrawer', () => {
	let wrapper: VueWrapper
	let mainStore

	beforeEach(() => {
		wrapper = mount(VApp, {
			slots: {
				default: h(BhNavigationDrawer),
			},
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

		mainStore = useMainStore()
	})

	it('should mount the component', async () => {
		expect(wrapper.findAll('.menu')).toMatchObject([])

		mainStore.profile = {}
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(BhNavigationDrawer).exists()).toBe(true)
	})
})
