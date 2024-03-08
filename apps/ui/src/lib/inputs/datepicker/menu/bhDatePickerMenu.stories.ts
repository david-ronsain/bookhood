import type { Meta, StoryObj } from '@storybook/vue3'
import BhDatePickerMenu, {
	type BhDatePickerMenuProps,
} from './bhDatePickerMenu.vue'

const meta: Meta<BhDatePickerMenuProps> = {
	component: BhDatePickerMenu,
	title: 'Design System/Inputs/BhDatePickerMenu',
	args: {
		locales: {
			dateLabel: 'Du {date1} au {date2}',
		},
		label: 'Date',
		placeholder: 'Choisir une date',
		clearable: true,
		minDate: new Date(),
		readonly: true,
	},
} satisfies Meta<BhDatePickerMenuProps>

export default meta
type Story = StoryObj<BhDatePickerMenuProps>

export const Single: Story = {}
Single.args = {
	multiple: false,
}

export const Multiple: Story = {}
Multiple.args = {
	multiple: true,
}
