import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import Message from '../../../src/components/conversation/message.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { useMainStore } from '../../../src/store'
import message from '../../../src/components/conversation/message.vue'
import { conversation } from '../../data/conversationData'

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

describe('Testing the component Message', () => {
	let wrapper: VueWrapper
	let mainStore

	beforeEach(async () => {
		wrapper = mount(Message, {
			props: {
				conversation,
				message,
			},
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
	})

	it('should mount the component', async () => {
		mainStore.profile = {
			_id: 'userId',
		}
		await wrapper.vm.$nextTick()
		expect(wrapper.findComponent(Message).exists()).toBe(true)
	})
})
