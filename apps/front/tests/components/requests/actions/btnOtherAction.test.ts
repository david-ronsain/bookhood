import { VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import BtnOtherAction from '../../../../src/components/requests/actions/btnOtherAction.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { mdiHelp } from '@mdi/js'
import { VBtn } from 'vuetify/lib/components/index.mjs'

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
		expect(wrapper.findComponent(BtnOtherAction).exists()).toBe(true)

		expect(wrapper.findComponent(BtnOtherAction).html()).toContain('help')
	})

	it('should emit the clicked event', () => {
		wrapper.findComponent(VBtn).vm.$emit('click')
		expect(wrapper.emitted('clicked')).toBeDefined()
	})
})
