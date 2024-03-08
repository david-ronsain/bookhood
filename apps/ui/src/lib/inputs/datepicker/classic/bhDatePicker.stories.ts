import type { Meta, StoryObj } from '@storybook/vue3'
import BhDatePicker, { type BhDatePickerProps } from './bhDatePicker.vue'

const meta: Meta<BhDatePickerProps> = {
	component: BhDatePicker,
	title: 'Design System/Inputs/BhDatePicker',
	args: {
		minDate: new Date(),
	},
} satisfies Meta<BhDatePickerProps>

export default meta
type Story = StoryObj<BhDatePickerProps>

export const Single: Story = {}
Single.args = {
	multiple: false,
}

export const Multiple: Story = {}
Multiple.args = {
	multiple: true,
}
