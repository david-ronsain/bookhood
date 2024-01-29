interface II18nConfig {
	availableLocales: I18nLocales[]
	fallbackLocale: I18nLocales
	defaultLocale: I18nLocales
}

interface IEnvConfig {
	i18n: II18nConfig
	api: IApiConfig
	googleApi: IGoogleApi
	settings: ISettingsConfig
}

interface ISettingsConfig {
	session: ISessionConfig
}

interface ISessionConfig {
	duration: number
}

enum I18nLocales {
	FR = 'fr',
}

interface IApiConfig {
	base: string
	url: {
		user: string
		auth: string
	}
}

interface IGoogleApi {
	url: string
	key: string
}

export const EnvConfig: IEnvConfig = {
	i18n: {
		availableLocales: (
			import.meta.env.VITE_APP_FRONT_I18N_AVAILABLE_LOCALES ||
			I18nLocales.FR
		).split(',') as I18nLocales[],
		fallbackLocale:
			import.meta.env.VITE_APP_FRONT_I18N_FALLBACK_LOCALE ||
			I18nLocales.FR,
		defaultLocale:
			import.meta.env.VITE_APP_FRONT_I18N_DEFAULT_LOCALE ||
			I18nLocales.FR,
	},
	api: {
		base: `${import.meta.env.VITE_APP_FRONT_API_GATEWAY_PROTOCOL}://${
			import.meta.env.VITE_APP_FRONT_API_GATEWAY_HOST
		}:${import.meta.env.VITE_APP_FRONT_API_GATEWAY_PORT}/${
			import.meta.env.VITE_APP_FRONT_API_GATEWAY_PREFIX
		}`,
		url: {
			user: `${import.meta.env.VITE_APP_FRONT_API_USER_PREFIX}`,
			auth: `${import.meta.env.VITE_APP_FRONT_API_AUTH_PREFIX}`,
		},
	},
	googleApi: {
		url: import.meta.env.VITE_APP_FRONT_GOOGLE_BOOKS_URL || '',
		key: import.meta.env.VITE_APP_FRONT_GOOGLE_API_KEY || '',
	},
	settings: {
		session: {
			duration: parseInt(
				import.meta.env.VITE_APP_FRONT_SESSION_DURATION || ''
			),
		},
	},
}
