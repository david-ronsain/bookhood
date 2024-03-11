/* eslint-disable @nx/enforce-module-boundaries */
import {
	IBook,
	IBookSearch,
	IBooksList,
	IBooksListResult,
	LibraryStatus,
	RequestStatus,
} from '../../../shared/src'

export const emptyBooksResults: IBooksList = {
	total: 0,
	results: [],
}

export const booksResults: IBooksList = {
	total: 15,
	results: Array.from(
		{ length: 15 },
		(value: unknown, index: number) =>
			({
				_id: `bookId#${index}`,
				title: `title${index}`,
				authors: [`author1#${index}`, `author2#${index}`],
				description: `description#${index}`,
				place: `place${index}`,
				status: LibraryStatus.TO_LEND,
				categories: [`category1#${index}`, `category2#${index}`],
				currentStatus: RequestStatus.ACCEPTED_PENDING_DELIVERY,
			}) as IBooksListResult,
	),
}

export const emptySearchResults: IBookSearch = {
	total: 0,
	results: [],
}

export const searchResults: IBookSearch = {
	total: 15,
	results: Array.from({ length: 15 }, (value: unknown, index: number) => ({
		_id: `bookId#${index}`,
		libraryId: `libraryId#${index}`,
		title: `title#${index}`,
		authors: [`author1#${index}`, `author2#${index}`],
		categories: [`category1#${index}`, `category2#${index}`],
		description: `description#${index}`,
		language: `fr`,
		publisher: `publisher#${index}`,
		publishedDate: `2023`,
		isbn: [
			{
				type: `ISBN_10`,
				identifier: `000#${index}`,
			},
		],
		owner: [
			{
				_id: `ownerId#${index}`,
				coords: {
					lat: 0,
					lng: 0,
				},
				user: {
					_id: `userId#${index}`,
					firstName: `first#${index}`,
					lastName: `last#${index}`,
					email: `email${index}@mail.com`,
					place: `place${index}`,
				},
			},
		],
	})),
}

export const bookToAdd: IBook = {
	_id: 'bookId',
	title: 'title',
	authors: ['authors'],
	categories: ['category'],
	description: 'desc',
	isbn: [{ type: 'ISBN_13', identifier: '0000' }],
	language: 'fr',
}
