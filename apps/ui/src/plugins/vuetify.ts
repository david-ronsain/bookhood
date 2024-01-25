import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	theme: {
		defaultTheme: 'lightTheme',
		themes: {
			lightTheme: {
				dark: false,
				colors: {
					primary: '#B71C1C',
				},
			},
		},
	},
	components,
	directives,
})
