import { Locale } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios, { type AxiosResponse } from 'axios'

export const useFetch = () => {
	const getLocale = (): string => {
		return navigator?.language
			? navigator?.language.substring(0, 2)
			: Locale.FR
	}

	const GET = (
		url: string,
		data: object = {},
		headers: object = {},
	): Promise<AxiosResponse<any, any>> =>
		axios.get(EnvConfig.api.base + url, {
			params: {
				...data,
			},
			headers: {
				'x-token': localStorage.getItem(EnvConfig.localStorage.userKey),
				'x-locale': getLocale(),
				...headers,
			},
		})

	const PATCH = (
		url: string,
		data: object = {},
		headers: object = {},
	): Promise<AxiosResponse<any, any>> =>
		axios.patch(EnvConfig.api.base + url, data, {
			headers: {
				'x-token': localStorage.getItem(EnvConfig.localStorage.userKey),
				'x-locale': getLocale(),
				...headers,
			},
		})

	const POST = (
		url: string,
		data: object = {},
		headers: object = {},
	): Promise<AxiosResponse<any, any>> =>
		axios.post(EnvConfig.api.base + url, data, {
			headers: {
				'x-token': localStorage.getItem(EnvConfig.localStorage.userKey),
				'x-locale': getLocale(),
				...headers,
			},
		})

	return {
		GET,
		PATCH,
		POST,
	}
}
