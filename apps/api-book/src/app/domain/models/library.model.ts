import { ILibrary, ILibraryLocation, LibraryStatus } from '@bookhood/shared'
import mongoose from 'mongoose'

export default class LibraryModel {
	constructor(library?: ILibrary) {
		if (library) {
			this._id = library._id?.toString()
			this.userId = new mongoose.Types.ObjectId(library.userId)
			this.bookId = new mongoose.Types.ObjectId(library.bookId)
			this.location = library.location
			this.status = library.status
			this.place = library.place
		}
	}

	readonly _id?: string

	readonly userId: mongoose.Types.ObjectId

	readonly bookId: mongoose.Types.ObjectId

	readonly location: ILibraryLocation

	readonly status: LibraryStatus

	readonly place: string
}
