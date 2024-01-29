import './styles.scss'
import 'node_modules/vuetify/dist/vuetify.min.css'

import fr from './locales/fr-fr.json'
import { EnvConfig } from '../config/env'
import { createApp } from 'vue'
import App from './app/App.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'

export const pinia = createPinia()
const i18n = createI18n({
	locale: EnvConfig.i18n.defaultLocale,
	availableLocales: EnvConfig.i18n.availableLocales,
	fallbackLocale: EnvConfig.i18n.fallbackLocale,
	messages: { fr },
	legacy: false,
	globalInjection: true,
})

const app = createApp(App)

app.config.globalProperties.authenticated = false

app.use(i18n)
app.use(vuetify)
app.use(pinia)
app.use(router)
app.mount('#root')
