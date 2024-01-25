import { setup } from '@storybook/vue3'
import type { App } from 'vue'
import vuetify from '../src/plugins/vuetify'
import { withVuetifyTheme } from './withVuetifyTheme.decorator'

setup((app: App) => {
	app.use(vuetify)
})

export const decoratos = [withVuetifyTheme]
