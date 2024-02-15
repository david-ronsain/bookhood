import { ILibrary, ILibraryLocation, LibraryStatus } from '@bookhood/shared'
import { Document } from 'mongoose'

export interface LibraryEntity extends Document, ILibrary {
	readonly _id: string

	readonly userId: string

	readonly bookId: string

	readonly location: ILibraryLocation

	readonly status: LibraryStatus

	readonly place: string

	readonly createdAt: string

	readonly updatedAt: string
}
