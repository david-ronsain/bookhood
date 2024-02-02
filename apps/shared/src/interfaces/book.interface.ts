export interface IAddBookDTO {
	title: string

	authors: string[]

	categories?: string[]

	description: string

	image?: IBookImageLinks

	isbn: IISBN[]

	language: string

	subtitle?: string

	publisher?: string

	publishedDate?: string
}

export interface IBook {
	_id?: string

	title: string

	authors: string[]

	categories?: string[]

	description: string

	image?: IBookImageLinks

	isbn: IISBN[]

	language: string

	subtitle?: string

	publisher?: string

	publishedDate?: string
}

export interface IISBN {
	type: 'ISBN_10' | 'ISBN_13' | string
	identifier: string
}

export interface IBookImageLinks {
	smallThumbnail: string
	thumbnail: string
}

export interface IBookSearch {
	results: IBookSearchResult[]

	total: number
}

export interface IBookSearchResult {
	_id: unknown

	title: string

	authors: string[]

	categories?: string[]

	description: string

	language: string

	publisher?: string

	publishedDate?: string

	isbn: IISBN[]

	owner: IBookSearchResultOwner
}

export interface IBookSearchResultOwner {
	_id: unknown

	coords: IBookSearchResultOwnerCoords

	user: IBookSearchResultOwnerUser
}

interface IBookSearchResultOwnerCoords {
	lat: number

	lng: number
}

export interface IBookSearchResultOwnerUser {
	_id: unknown

	firstName: string

	lastName: string

	email: string
}
