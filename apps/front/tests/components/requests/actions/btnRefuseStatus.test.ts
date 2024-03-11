import { VueWrapper, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import BtnRefuseStatus from '../../../../src/components/requests/actions/btnRefuseStatus.vue'
import vuetify from '../../../../src/plugins/vuetify'
import { createTestingPinia } from '@pinia/testing'
import { VBtn } from 'vuetify/lib/components/index.mjs'

describe('Testing the component BtnRefuseStatus', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(BtnRefuseStatus, {
			attachTo: document.body,
			props: {
				tooltip: 'cancel',
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
		expect(wrapper.findComponent(BtnRefuseStatus).exists()).toBe(true)

		expect(wrapper.findComponent(BtnRefuseStatus).html()).toContain(
			'cancel',
		)
	})

	it('should emit the status:refused event', () => {
		wrapper.findComponent(VBtn).vm.$emit('click')
		expect(wrapper.emitted('status:refused')).toBeDefined()
	})
})
