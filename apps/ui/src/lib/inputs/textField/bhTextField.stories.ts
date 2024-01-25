import type { Meta } from '@storybook/vue3'
import BhTextField from './bhTextField.vue'
import { type BhTextFieldProps } from './bhTextField.vue'
import { mdiClose } from '@mdi/js'

const meta: Meta<typeof BhTextField> = {
	component: BhTextField,
	title: 'Design System/Inputs/BhTextField',
}
export default meta

const Template = (args: BhTextFieldProps) => ({
	components: { BhTextField },
	setup: () => ({ args }),
	template: '<BhTextField v-bind="args" />',
})

export const Classic = Template.bind({})
Classic.args = {
	autofocus: true,
	clear: true,
	label: 'Field',
	placeholder: 'Example',
}

export const Autofocused = Template.bind({})
Autofocused.args = {
	autofocus: true,
}

export const Clear = Template.bind({})
Clear.args = {
	clear: true,
}

export const PrependIcon = Template.bind({})
PrependIcon.args = {
	icon: {
		icon: mdiClose,
		prepend: true,
	},
}

export const AppendIcon = Template.bind({})
AppendIcon.args = {
	icon: {
		icon: mdiClose,
		append: true,
	},
}

export const Label = Template.bind({})
Label.args = {
	label: 'Label',
}

export const Placeholder = Template.bind({})
Placeholder.args = {
	placeholder: 'Example',
}

export const TypeNumber = Template.bind({})
TypeNumber.args = {
	type: 'number',
	step: 5,
	min: 1,
}
