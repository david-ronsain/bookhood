import { ILibrary, ILibraryLocation } from '@bookhood/shared'
import { Document } from 'mongoose'

export interface LibraryEntity extends Document, ILibrary {
	readonly _id: string

	readonly userId: string

	readonly bookId: string

	readonly location: ILibraryLocation

	readonly createdAt: string

	readonly updatedAt: string
}
