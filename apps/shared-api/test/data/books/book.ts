/* eslint-disable @nx/enforce-module-boundaries */
import { IAddBookDTO, IBookSearch, LibraryStatus } from '../../../../shared/src'

export const addBookDTO: IAddBookDTO = {
	authors: ['author'],
	description: 'desc',
	isbn: [
		{
			type: 'ISBN_13',
			identifier: '01234567890123',
		},
	],
	language: 'fr',
	title: 'title',
	categories: ['category'],
	image: { smallThumbnail: '', thumbnail: '' },
	publishedDate: '2024',
	publisher: 'publisher',
	subtitle: 'subtitle',
	location: {
		lat: 0,
		lng: 0,
	},
	status: LibraryStatus.TO_LEND,
	place: 'Some place',
}

export const bookModel = {
	authors: ['author'],
	description: 'desc',
	isbn: [
		{
			type: 'ISBN_13',
			identifier: '01234567890123',
		},
	],
	language: 'fr',
	title: 'title',
	categories: ['category'],
	image: { smallThumbnail: '', thumbnail: '' },
	publishedDate: '2024',
	publisher: 'publisher',
	subtitle: 'subtitle',
	status: LibraryStatus.TO_LEND,
	place: 'Some place',
	_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
}

export const emptyBookSearch: IBookSearch = {
	results: [],
	total: 0,
}
