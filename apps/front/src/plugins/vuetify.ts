import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { fr } from 'vuetify/locale'

export default createVuetify({
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	locale: {
		locale: 'fr',
		messages: { fr },
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
})
