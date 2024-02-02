import { IBook, IBookImageLinks, IISBN } from '@bookhood/shared'
import { Document } from 'mongoose'

export interface BookEntity extends Document, IBook {
	readonly _id: string

	readonly title: string

	readonly authors: string[]

	readonly categories?: string[]

	readonly description: string

	readonly image?: IBookImageLinks

	readonly isbn: IISBN[]

	readonly language: string

	readonly subtitle?: string

	readonly publisher?: string

	readonly publishedDate?: string

	readonly createdAt: string

	readonly updatedAt: string
}
