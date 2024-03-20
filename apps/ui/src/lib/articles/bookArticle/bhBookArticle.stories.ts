import type { Meta } from '@storybook/vue3'
import BhBookArticle, { type IBhBookArticleProps } from './bhBookArticle.vue'

const meta: Meta<typeof BhBookArticle> = {
	component: BhBookArticle,
	title: 'Design System/Articles/BhBookArticle',
}
export default meta

const Template = (args: IBhBookArticleProps) => ({
	components: { BhBookArticle },
	setup: () => ({ args }),
	template: '<BhBookArticle v-bind="args" />',
})

export const Classic = Template.bind({})
