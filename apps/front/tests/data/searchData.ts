/* eslint-disable @nx/enforce-module-boundaries */
import { IBookSearch } from '../../../shared/src'

export const emptySearchResults: IBookSearch = {
	total: 0,
	results: [],
}

export const searchResults: IBookSearch = {
	total: 11,
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
		owner: {
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
			},
		},
	})),
}
