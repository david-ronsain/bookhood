import type { Meta, StoryObj } from '@storybook/vue3'
import BhBookArticle from './bhBookArticle.vue'

const meta: Meta<typeof BhBookArticle> = {
	component: BhBookArticle,
	title: 'bookArticle',
}
export default meta
type Story = StoryObj<typeof meta>

export const Primary = {
	args: {},
}
