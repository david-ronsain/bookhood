import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import CreateMessage from '../../../src/components/conversation/createMessage.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
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

describe('Testing the component CreateMessage', () => {
	let wrapper: VueWrapper

	beforeEach(async () => {
		wrapper = mount(CreateMessage, {
			props: {
				conversation,
				roomId: conversation.roomId,
				requestId: conversation.request._id,
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
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(CreateMessage).exists()).toBe(true)
	})
})
