import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import BhHeader from '../../../../src/components/layout/header/BhHeader.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { h } from 'vue'
import { VApp } from 'vuetify/components'
import { useMainStore } from '../../../../src/store'

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

describe('Testing the header', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(VApp, {
			slots: {
				default: h(BhHeader),
			},
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: ['router-link'],
			},
		})
	})

	it('should display the header', async () => {
		const store = useMainStore()
		store.$patch({ profile: {} })
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent({ name: 'BhHeader' })).toBeTruthy()

		expect(wrapper.find('.profilepic').trigger('click'))
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent({ name: 'BhHeader' }).emitted(),
		).toHaveProperty('changeDrawerStatus')

		expect(wrapper.find('.profile-name').exists()).toBeTruthy()
	})
})
