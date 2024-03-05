import { IBooksList, IBooksListResult } from '@bookhood/shared'

export class BooksList implements IBooksList {
	results: IBooksListResult[]

	total: number
}
