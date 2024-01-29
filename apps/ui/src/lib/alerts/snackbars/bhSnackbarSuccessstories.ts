import type { Meta } from '@storybook/vue3'
import BhSnackbarSuccess, {
	type BhSnackbarSuccessProps,
} from './bhSnackbarSuccess.vue'

const meta: Meta<typeof BhSnackbarSuccess> = {
	component: BhSnackbarSuccess,
	title: 'Design System / Alerts / Snackbars / BhSnackbarSuccess',
}
export default meta

const Template = (args: BhSnackbarSuccessProps) => ({
	components: { BhSnackbarSuccess },
	setup: () => ({ args }),
	template: '<BhSnackbarSuccess v-bind="args"></BhSnackbarSuccess>',
})

export const Classic = Template.bind({})
Classic.args = {
	opened: true,
	text: 'This is a success',
}
