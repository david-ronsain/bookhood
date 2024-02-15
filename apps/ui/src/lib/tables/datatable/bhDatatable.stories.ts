import type { Meta } from '@storybook/vue3'
import BhDatatable from './bhDatatable.vue'

const meta: Meta<typeof BhDatatable> = {
	component: BhDatatable,
	title: 'Design System/Tables/BhDatatable',
}
export default meta

const Template = () => ({
	components: { BhDatatable },
	template: '<BhDatatable v-bind="args" />',
})

export const Classic = Template.bind({})
Classic.args = {}
