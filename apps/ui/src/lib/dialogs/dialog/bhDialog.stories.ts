import type { Meta } from '@storybook/vue3'
import BhDialog from './bhDialog.vue'
import type { IBhDialogProps } from 'apps/ui/src/interfaces/bhDialog.interface'

const meta: Meta<typeof BhDialog> = {
	component: BhDialog,
	title: 'Design System/Dialogs/BhCard',
}
export default meta

const Template = (args: IBhDialogProps) => ({
	components: { BhDialog },
	setup: () => ({ args }),
	template: '<BhDialog v-bind="args" />',
})

export const Classic = Template.bind({})
