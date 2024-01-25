import type { Meta } from '@storybook/vue3'
import BhCheckBox from './bhCheckBox.vue'
import { mdiInformation } from '@mdi/js'

const meta: Meta<typeof BhCheckBox> = {
	component: BhCheckBox,
	title: 'Design System/Inputs/BhCheckBox',
}
export default meta

const Template = (args: unknown) => ({
	components: { BhCheckBox },
	setup: () => ({ args }),
	template: '<BhCheckBox v-bind="args" />',
})

export const Classic = Template.bind({})

export const Disabled = Template.bind({})
Disabled.args = {
	disabled: true,
}

export const Icon = Template.bind({})
Icon.args = {
	icon: {
		prepend: mdiInformation,
		append: mdiInformation,
	},
}

export const Label = Template.bind({})
Label.args = {
	label: "Je suis d'accord",
}
