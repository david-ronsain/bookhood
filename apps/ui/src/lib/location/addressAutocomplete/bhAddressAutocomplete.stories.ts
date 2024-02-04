import type { Meta, StoryObj } from '@storybook/vue3'
import bhAddressAutocomplete from './bhAddressAutocomplete.vue'

const meta: Meta<typeof bhAddressAutocomplete> = {
	component: bhAddressAutocomplete,
	title: 'bhAddressAutocomplete',
}
export default meta
type Story = StoryObj<typeof meta>

export const Primary = {
	args: {},
}
