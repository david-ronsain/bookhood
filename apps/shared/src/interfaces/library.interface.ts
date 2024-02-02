export interface ILibrary {
	_id?: string

	userId: string

	bookId: string

	location: ILibraryLocation
}

export interface ILibraryLocation {
	type: string

	coordinates: number[]
}
