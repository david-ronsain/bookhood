import type { Meta } from '@storybook/vue3'
import BhSnackbarError, {
	type BhSnackbarErrorProps,
} from './bhSnackbarError.vue'

const meta: Meta<typeof BhSnackbarError> = {
	component: BhSnackbarError,
	title: 'Design System / Alerts / Snackbars / BhSnackbarError',
}
export default meta

const Template = (args: BhSnackbarErrorProps) => ({
	components: { BhSnackbarError },
	setup: () => ({ args }),
	template: '<BhSnackbarError v-bind="args"></BhSnackbarError>',
})

export const Classic = Template.bind({})
Classic.args = {
	opened: true,
	text: 'This is an error',
}
