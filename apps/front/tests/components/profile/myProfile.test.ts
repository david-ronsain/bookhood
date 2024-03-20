import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import vuetify from '../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { useProfileStore } from '../../../src/store'
import { myProfile, userStats } from '../../data/profileData'
import MyProfile from '../../../src/components/profile/myProfile.vue'

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

describe('Testing the component MyProfile', () => {
	let wrapper: VueWrapper
	let profileStore

	beforeEach(() => {
		vi.clearAllMocks()
		wrapper = mount(MyProfile, {
			props: {
				profile: myProfile,
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

		profileStore = useProfileStore()
	})

	it('should mount the component', () => {
		expect(wrapper.findAll('.profile-stats')).toMatchObject([])
		expect(wrapper.findComponent(MyProfile).exists()).toBe(true)
	})

	it('should mount the component with stats', async () => {
		profileStore.stats = userStats
		await wrapper.vm.$nextTick()

		expect(wrapper.findComponent(MyProfile).text()).toContain(
			'account.myProfile.nbBooks',
		)
	})
})
