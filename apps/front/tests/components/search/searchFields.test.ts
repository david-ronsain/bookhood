/* eslint-disable @nx/enforce-module-boundaries */
import { VueWrapper, config, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import SearchFields from '../../../src/components/search/searchFields.vue'
import vuetify from '../../../src/plugins/vuetify'
import { VBtnToggle } from 'vuetify/lib/components/index.mjs'
import BhAddressAutocomplete from '../../../../ui/src/lib/location/addressAutocomplete/bhAddressAutocomplete.vue'
import BhTextField from '../../../../ui/src/lib/inputs/textField/bhTextField.vue'

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (key: string) => key,
		d: (key: string) => key,
	}),
}))

config.global.mocks = {
	$t: (tKey) => tKey,
}

vi.useFakeTimers()

describe('Testing the component SearchFields', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = mount(SearchFields, {
			attachTo: document.body,
			global: {
				plugins: [vuetify],
				stubs: {
					VBtnToggle: {
						name: 'VBtnToggle',
						template: '<div class="toggle"><slot/></div>',
						emits: ['update:modelValue'],
					},
					BhTextField: {
						name: 'BhTextField',
						template: '<div class="text-field"><slot/></div>',
						emits: [
							'click:clear',
							'update:modelValue',
							'update:focused',
						],
					},
					BhAddressAutocomplete: {
						name: 'BhAddressAutocomplete',
						template: '<div class="address"><slot/></div>',
						expose: ['center:updated'],
					},
				},
			},
		})
	})

	it('should mount the component', async () => {
		expect(wrapper.findComponent(SearchFields).exists()).toBe(true)
		expect(wrapper.findComponent(VBtnToggle).exists()).toBe(true)
		expect(wrapper.findComponent(BhTextField).exists()).toBe(true)
		expect(wrapper.findComponent(BhAddressAutocomplete).exists()).toBe(true)
	})

	it('should receive an update:modelValue from the toggle', async () => {
		wrapper.findComponent(VBtnToggle).vm.$emit('update:modelValue')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchFields).emitted('search'),
		).toBeDefined()
	})

	it('should receive an click:clear from the textfield', async () => {
		wrapper.findComponent(BhTextField).vm.$emit('click:clear')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchFields).emitted('reset'),
		).toBeDefined()
	})

	it('should receive an update:modelValue from the textfield', async () => {
		wrapper.findComponent(BhTextField).vm.$emit('update:modelValue')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchFields).emitted('search'),
		).toBeDefined()
	})

	it('should receive an update:focused from the textfield', async () => {
		wrapper.findComponent(BhTextField).vm.$emit('update:focused')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchFields).emitted('search'),
		).toBeDefined()
	})

	it('should receive an center:updated from the address autocomplete', async () => {
		wrapper.findComponent(BhAddressAutocomplete).vm.$emit('center:updated')
		await wrapper.vm.$nextTick()

		expect(
			wrapper.findComponent(SearchFields).emitted('center:changed'),
		).toBeDefined()
	})
})
