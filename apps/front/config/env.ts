interface II18nConfig {
	availableLocales: I18nLocales[]
	fallbackLocale: I18nLocales
	defaultLocale: I18nLocales
}

interface IEnvConfig {
	i18n: II18nConfig
	api: IApiConfig
	googleApis: IGoogleApi
	settings: ISettingsConfig
	socket: ISocketConfig
	localStorage: ILocalStorageConfig
}

interface ILocalStorageConfig {
	userKey: string
}

interface ISocketConfig {
	url: string
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
		book: string
		request: string
		library: string
	}
}

interface IGoogleApi {
	maps: IGoogleMapsApi
}

interface IGoogleMapsApi {
	key: string
	blueIcon: string
	redIcon: string
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
			book: `${import.meta.env.VITE_APP_FRONT_API_BOOK_PREFIX}`,
			request: `${import.meta.env.VITE_APP_FRONT_API_REQUEST_PREFIX}`,
			library: `${import.meta.env.VITE_APP_FRONT_API_LIBRARY_PREFIX}`,
		},
	},
	googleApis: {
		maps: {
			key: import.meta.env.VITE_APP_FRONT_GOOGLE_MAPS_API_KEY || '',
			blueIcon:
				import.meta.env.VITE_APP_FRONT_GOOGLE_MAPS_BLUE_ICON || '',
			redIcon: import.meta.env.VITE_APP_FRONT_GOOGLE_MAPS_RED_ICON || '',
		},
	},
	settings: {
		session: {
			duration: parseInt(
				import.meta.env.VITE_APP_FRONT_SESSION_DURATION || '',
			),
		},
	},
	socket: {
		url: import.meta.env.VITE_APP_SOCKET_URL || '',
	},
	localStorage: {
		userKey: import.meta.env.VITE_APP_LOCALSTORAGE_USER_KEY,
	},
}
