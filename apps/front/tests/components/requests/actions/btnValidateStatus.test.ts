import { VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import BtnValidateStatus from '../../../../src/components/requests/actions/btnValidateStatus.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { mdiCheck } from '@mdi/js'

describe('Testing the component BtnValidateStatus', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(BtnValidateStatus, {
			attachTo: document.body,
			props: {
				tooltip: 'confirm',
				icon: mdiCheck,
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
		expect(wrapper.findComponent(BtnValidateStatus).exists()).toBe(true)

		expect(wrapper.findComponent(BtnValidateStatus).html()).toContain(
			'confirm',
		)
	})
})
