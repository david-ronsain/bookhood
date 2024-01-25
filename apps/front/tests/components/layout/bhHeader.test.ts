import { it, describe, beforeEach, expect, vi } from 'vitest'
import { VueWrapper, mount, config } from '@vue/test-utils'
import BhHeader from '../../../src/components/layout/BhHeader.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

describe('Testing the header', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		const div = document.createElement('v-app')
		document.body.appendChild(div)
		wrapper = mount({
			template: '<v-app><bh-header /></v-app>',
			attachTo: div,
			global: {
				components: {
					BhHeader,
				},
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
			},
		})
	})

	it('should display the header', async () => {
		expect(wrapper.findComponent({ name: 'BhHeader' })).toBeTruthy()
	})
})
