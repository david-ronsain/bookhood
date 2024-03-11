import { VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import BtnValidateStatus from '../../../../src/components/requests/actions/btnValidateStatus.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { mdiCheck } from '@mdi/js'
import { VBtn } from 'vuetify/lib/components/index.mjs'

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
						template:
							'<div class="tooltip"><slot name="activator"/></div>',
						props: {
							attach: true,
						},
					},
					VBtn: {
						name: 'VBtn',
						template: '<div class="btn"><slot/></div>',
						emits: ['click'],
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

	it('should emit the status:validated event', () => {
		wrapper.findComponent(VBtn).vm.$emit('click')
		expect(wrapper.emitted('status:validated')).toBeDefined()
	})
})
