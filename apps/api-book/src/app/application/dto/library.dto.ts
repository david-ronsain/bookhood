import { LibraryStatus } from '@bookhood/shared'

export interface GetLibrariesListDTO {
	token: string

	userId: string

	page: number
}

export interface PatchLibraryDTO {
	token: string

	libraryId: string

	status: LibraryStatus
}
