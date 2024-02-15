import { LibraryStatus } from '../enums'
import { IBook } from './book.interface'
import { IUser } from './user.interface'

export interface ILibrary {
	_id?: string

	userId: string

	bookId: string

	location: ILibraryLocation

	status: LibraryStatus

	place: string
}

export interface ILibraryLocation {
	type: string

	coordinates: number[]
}

export interface ILibraryFull {
	_id?: string

	book: IBook

	location: ILibraryLocation

	user?: IUser
}
