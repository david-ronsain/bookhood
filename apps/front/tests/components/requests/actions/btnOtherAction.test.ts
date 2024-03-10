import { VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import BtnOtherAction from '../../../../src/components/requests/actions/btnOtherAction.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { mdiHelp } from '@mdi/js'

describe('Testing the component BtnOtherAction', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(BtnOtherAction, {
			attachTo: document.body,
			props: {
				tooltip: 'help',
				icon: mdiHelp,
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
		expect(wrapper.findComponent(BtnOtherAction).exists()).toBe(true)

		expect(wrapper.findComponent(BtnOtherAction).html()).toContain('help')
	})
})
