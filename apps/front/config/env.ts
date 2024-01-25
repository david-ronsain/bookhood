interface II18nConfig {
	availableLocales: I18nLocales[]
	fallbackLocale: I18nLocales
	defaultLocale: I18nLocales
}

interface IEnvConfig {
	i18n: II18nConfig
	api: IApiConfig
}

enum I18nLocales {
	FR = 'fr',
}

interface IApiConfig {
	url: {
		user: string
	}
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
		url: {
			user: `${import.meta.env.VITE_APP_FRONT_API_GATEWAY_PROTOCOL}://${
				import.meta.env.VITE_APP_FRONT_API_GATEWAY_HOST
			}:${import.meta.env.VITE_APP_FRONT_API_GATEWAY_PORT}/${
				import.meta.env.VITE_APP_FRONT_API_GATEWAY_PREFIX
			}${import.meta.env.VITE_APP_FRONT_API_USER_PREFIX}`,
		},
	},
}
