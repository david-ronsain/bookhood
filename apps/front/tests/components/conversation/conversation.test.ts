import { VueWrapper, config, mount } from '@vue/test-utils'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { vi } from 'vitest'
import Conversation from '../../../src/components/conversation/conversation.vue'
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

describe('Testing the component Conversation', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(Conversation, {
			props: {
				conversation,
			},
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					Message: {
						name: 'Message',
						template: '<div class="message"></div>',
						props: {
							conversation,
						},
					},
					CreateMessage: {
						name: 'CreateMessage',
						template: '<div class="create-message"></div>',
						props: {
							conversation,
						},
					},
				},
			},
		})
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(Conversation).exists()).toBe(true)
	})
})
