import type { IISBN, IBookImageLinks } from '@bookhood/shared'

export interface IGoogleBook {
	volumeInfo: IGoogleBookVolumeInfo

	[key: string]: unknown
}

export interface IGoogleBookVolumeInfo {
	industryIdentifiers?: IISBN[]
	title: string
	authors: string[]
	categories: string[]
	description: string
	imageLinks: IBookImageLinks
	language: string
	subtitle: string
	publisher: string
	publishedDate: string

	[key: string]: unknown
}
