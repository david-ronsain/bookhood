export interface IGoogleBook {
	volumeInfo: IGoogleBookVolumeInfo

	[key: string]: unknown
}

export interface IGoogleBookVolumeInfo {
	industryIdentifiers?: IGoogleBookIndustryIdentifier[]
	title: string
	authors: string[]
	categories: string[]
	description: string[]
	imageLinks: IGoogleBookImageLinks
	language: string
	subtitle: string
	publisher: string
	publishedDate: string

	[key: string]: unknown
}

export interface IGoogleBookIndustryIdentifier {
	type: 'ISBN_10' | 'ISBN_13' | string
	identifier: string
}

export interface IGoogleBookImageLinks {
	smallThumbnail: string
	thumbnail: string
}

export interface IBookAutocompleteItem {
	value: string
	title: string
	authors: string[]
	categories: string[]
	description: string[]
	image: string | undefined | null
	isbn: IGoogleBookIndustryIdentifier[]
	language: string
	subtitle: string
	publisher: string
	publishedDate: string
}
