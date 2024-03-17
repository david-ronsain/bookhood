import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import Account from '../../src/views/Account.vue'
import vuetify from '../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import YourBooks from '../../src/components/account/books/yourBooks/yourBooks.vue'
import CreateBookDialog from '../../src/components/dialogs/book/createBookDialog.vue'
import { myProfile as profileData } from '../data/profileData'
import MyProfile from '../../src/components/profile/myProfile.vue'

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

describe('Testing the view Account', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(Account, {
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					CreateBookDialog: {
						name: 'CreateBookDialog',
						template:
							'<div class="v-dialog-stub" @bookCreated="() => loadBooks()"></div>',
						emits: ['bookCreated'],
						methods: {
							open: () => vi.fn(),
						},
					},
					YourBooks: {
						name: 'YourBooks',
						template: '<div class="your-books"></div>',
						emits: ['bookCreated'],
						methods: {
							open: () => vi.fn(),
						},
					},
					MyProfile: {
						name: 'MyProfile',
						template: '<div class="my-profile"></div>',
						props: {
							myProfile: profileData,
						},
					},
				},
			},
		})
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(Account)).toBeTruthy()
		expect(wrapper.findComponent(YourBooks)).toBeTruthy()
		expect(wrapper.findComponent(MyProfile)).toBeTruthy()
		expect(wrapper.findComponent(CreateBookDialog).exists()).toBe(true)
	})

	it('should show the button to add a book', async () => {
		expect(wrapper.find('.add-book').exists()).toBeTruthy()
		await wrapper.find('.add-book').trigger('click')
		await wrapper.vm.$nextTick()

		expect(wrapper.emitted()).toHaveProperty('click')
	})

	it('should reload the list if a book has been created', async () => {
		wrapper.findComponent(CreateBookDialog).vm.$emit('bookCreated')
		wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(CreateBookDialog).emitted(),
		).toHaveProperty('bookCreated')
	})
})
