import { Locale } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios from 'axios'

export const useFetch = () => {
	const getLocale = (): string => {
		return navigator?.language
			? navigator?.language.substring(0, 2)
			: Locale.FR
	}

	const GET = (url: string, data: object = {}, headers: object = {}) =>
		axios.get(url, {
			params: {
				...data,
			},
			headers: {
				'x-token': localStorage.getItem(EnvConfig.localStorage.userKey),
				'x-locale': getLocale(),
				...headers,
			},
		})

	return {
		GET,
	}
}
