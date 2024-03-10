import { VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import BtnRefuseStatus from '../../../../src/components/requests/actions/btnRefuseStatus.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { mdiClose } from '@mdi/js'

describe('Testing the component BtnRefuseStatus', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(BtnRefuseStatus, {
			attachTo: document.body,
			props: {
				tooltip: 'cancel',
				icon: mdiClose,
			},
			global: {
				plugins: [
					vuetify,
					createTestingPinia({
						createSpy: vi.fn,
					}),
				],
				stubs: {
					VTooltip: {
						name: 'VTooltip',
						template: '<div class="tooltip"><slot/></div>',
						props: {
							attach: true,
						},
					},
				},
			},
		})
	})

	it('should mount the component', () => {
		expect(wrapper.findComponent(BtnRefuseStatus).exists()).toBe(true)

		expect(wrapper.findComponent(BtnRefuseStatus).html()).toContain(
			'cancel',
		)
	})
})
