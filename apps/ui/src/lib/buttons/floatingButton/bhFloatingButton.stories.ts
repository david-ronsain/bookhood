import type { Meta } from '@storybook/vue3'
import BhFloatingButton from './bhFloatingButton.vue'
import { type IBhFloatingButtonProps } from '../../../interfaces/bhFloatingButton.interface'

const meta: Meta<typeof BhFloatingButton> = {
	component: BhFloatingButton,
	title: 'Design System/Buttons/BhFloatingButton',
}
export default meta

const Template = (args: IBhFloatingButtonProps) => ({
	components: { BhFloatingButton },
	setup: () => ({ args }),
	template: '<BhFloatingButton v-bind="args"></BhFloatingButton>',
})

export const Classic = Template.bind({})
