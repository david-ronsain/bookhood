import type { Meta } from '@storybook/vue3'
import BhAddressAutocomplete from './bhAddressAutocomplete.vue'

const meta: Meta<typeof BhAddressAutocomplete> = {
	component: BhAddressAutocomplete,
	title: 'Design System/Location/BhAddressAutocomplete',
}
export default meta

const Template = (args: { placeholder: string }) => ({
	components: { BhAddressAutocomplete },
	setup: () => ({ args }),
	template: '<BhAddressAutocomplete v-bind="args" />',
})

export const Classic = Template.bind({})
Classic.args = {
	placeholder: 'Search',
}
