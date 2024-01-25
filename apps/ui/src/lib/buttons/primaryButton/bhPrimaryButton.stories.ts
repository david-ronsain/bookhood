import type { Meta } from '@storybook/vue3'
import BhPrimaryButton from './bhPrimaryButton.vue'
import { type BhPrimaryButtonProps } from './bhPrimaryButton.vue'
import { mdiCheck } from '@mdi/js'

const meta: Meta<typeof BhPrimaryButton> = {
	component: BhPrimaryButton,
	title: 'Design System/Buttons/BhPrimaryButton',
	args: {
		to: { name: 'signup' },
		text: 'suivant',
	},
}
export default meta

const Template = (args: BhPrimaryButtonProps) => ({
	components: { BhPrimaryButton },
	setup: () => ({ args }),
	template:
		'<BhPrimaryButton v-bind="args">{{ args.text }}</BhPrimaryButton>',
})

export const Classic = Template.bind({})

export const NoBackground = Template.bind({})
NoBackground.args = {
	noBackground: true,
}

export const Loading = Template.bind({})
Loading.args = {
	loading: true,
}

export const Icon = Template.bind({})
Icon.args = {
	icon: {
		icon: mdiCheck,
		prepend: true,
	},
}

export const Disabled = Template.bind({})
Disabled.args = {
	disabled: true,
}
