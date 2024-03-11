import { LibraryStatus, RequestStatus } from '../enums'

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

	location: ICoords

	status: LibraryStatus

	place: string
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

	status?: LibraryStatus
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

	libraryId: string

	title: string

	authors: string[]

	categories?: string[]

	description: string

	language: string

	publisher?: string

	publishedDate?: string

	isbn: IISBN[]

	owner: IBookSearchResultOwner[]
}

export interface IBookSearchResultOwner {
	_id: string

	coords: ICoords

	user: IBookSearchResultOwnerUser
}

export interface ICoords {
	lat: number

	lng: number
}

export interface IBookSearchResultOwnerUser {
	_id: unknown

	firstName: string

	lastName: string

	email: string

	place?: string
}

export interface IBooksList {
	results: IBooksListResult[]

	total: number
}

export interface IBooksListResult {
	_id: string

	title: string

	authors: string[]

	description: string

	place: string

	status: LibraryStatus

	categories: string[]

	currentStatus?: RequestStatus
}
