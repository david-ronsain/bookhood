import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import ProfileCard from '../../../src/components/profile/profileCard.vue'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { useProfileStore } from '../../../src/store'
import { externalProfile } from '../../data/profileData'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

vi.mock('vue-router', () => ({
	useRoute: vi.fn().mockReturnValue({
		params: {
			userId: 'userId',
		},
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

global.ResizeObserver = require('resize-observer-polyfill')

describe('Testing the component ProfileCard', () => {
	let wrapper: VueWrapper
	let profileStore

	beforeEach(() => {
		vi.clearAllMocks()
		wrapper = mount(ProfileCard, {
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
			},
		})

		profileStore = useProfileStore()
	})

	it('should mount the component', () => {
		profileStore.loadProfile = () => vi.fn()
		expect(wrapper.findAll('.profile-card')).toMatchObject([])
		expect(wrapper.findComponent(ProfileCard).exists()).toBe(true)
	})

	it('should mount the component with a profile', async () => {
		profileStore.profile = externalProfile
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(ProfileCard).text()).toContain(
			profileStore.profile.firstName,
		)
	})
})
