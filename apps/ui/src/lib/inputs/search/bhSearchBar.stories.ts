import type { Meta } from '@storybook/vue3'
import BhSearchBar, { type BhSearchBarProps } from './bhSearchBar.vue'

const meta: Meta<typeof BhSearchBar> = {
	component: BhSearchBar,
	title: 'Design System / Inputs / BhSearchBar',
}
export default meta

const Template = (args: BhSearchBarProps) => ({
	components: { BhSearchBar },
	setup: () => ({ args }),
	template: '<BhSearchBar v-bind="args"></BhSearchBar>',
})

export const Classic = Template.bind({})
Classic.args = {
	label: 'Search a book, an author',
	placeholder: 'Search',
}
