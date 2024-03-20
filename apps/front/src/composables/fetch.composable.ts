/* eslint-disable @typescript-eslint/no-explicit-any */
import { Locale } from '@bookhood/shared'
import { EnvConfig } from '../../config/env'
import axios, { type AxiosResponse } from 'axios'

export const useFetch = () => {
	const getLocale = (): string => {
		return navigator?.language
			? navigator?.language.substring(0, 2)
			: Locale.FR
	}

	const getHeaders = (headers: object): object => ({
		headers: {
			...headers,
			[EnvConfig.settings.session.token]: localStorage.getItem(
				EnvConfig.localStorage.userKey,
			),
			[EnvConfig.i18n.localeToken]: getLocale(),
		},
	})

	const GET = (
		url: string,
		data: object = {},
		headers: object = {},
	): Promise<AxiosResponse<any, any>> =>
		axios.get(EnvConfig.api.base + url, {
			params: {
				...data,
			},
			...getHeaders(headers),
		})

	const PATCH = (
		url: string,
		data: object = {},
		headers: object = {},
	): Promise<AxiosResponse<any, any>> =>
		axios.patch(EnvConfig.api.base + url, data, {
			...getHeaders(headers),
		})

	const POST = (
		url: string,
		data: object = {},
		headers: object = {},
	): Promise<AxiosResponse<any, any>> =>
		axios.post(EnvConfig.api.base + url, data, {
			...getHeaders(headers),
		})

	return {
		GET,
		PATCH,
		POST,
	}
}
