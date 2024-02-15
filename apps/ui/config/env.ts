interface IGoogleApisConfig {
	key: string
	places: IGoogleApiPlacesConfis
}

interface IGoogleApiPlacesConfis {
	url: string
}

interface IEnvConfig {
	googleApis: IGoogleApisConfig
}

export const EnvConfig: IEnvConfig = {
	googleApis: {
		key: import.meta.env.VITE_APP_FRONT_GOOGLE_MAPS_API_KEY ?? '',
		places: {
			url: import.meta.env.VITE_APP_FRONT_GOOGLE_PLACES_URL ?? '',
		},
	},
}
