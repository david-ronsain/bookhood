import type { Meta } from '@storybook/vue3'
import BhCard from './bhCard.vue'
import type { IBhCardProps } from '../../../interfaces/bhCard.interface'

const meta: Meta<typeof BhCard> = {
	component: BhCard,
	title: 'Design System/Cards/BhCard',
}
export default meta

const Template = (args: IBhCardProps) => ({
	components: { BhCard },
	setup: () => ({ args }),
	template: '<BhCard v-bind="args" />',
})

export const Classic = Template.bind({})
