import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { IConversationFull } from '../../../../shared/src'
import CreateMessage from '../../../src/components/conversation/createMessage.vue'
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

global.ResizeObserver = require('resize-observer-polyfill')

describe('Testing the component CreateMessage', () => {
	let wrapper: VueWrapper

	const conversation: IConversationFull = {
		_id: 'convId',
		roomId: 'roomId',
		request: {
			_id: 'reqId',
			createdAt: new Date().toISOString(),
			book: {
				title: 'title',
			},
			emitter: {
				email: '1@email.test',
				firstName: 'first1',
				lastName: 'last1',
				_id: 'userId1',
			},
			owner: {
				email: '2@email.test',
				firstName: 'first2',
				lastName: 'last2',
				_id: 'userId2',
			},
		},
		messages: [
			{
				_id: 'msg1',
				from: 'userId1',
				message: 'message',
				seenBy: [],
			},
		],
	}

	beforeEach(async () => {
		wrapper = mount(CreateMessage, {
			props: {
				conversationId: conversation._id,
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
