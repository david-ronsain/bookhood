/* eslint-disable @nx/enforce-module-boundaries */
import {
	IAddBookDTO,
	IBook,
	IBookSearch,
	IBookSearchResultOwner,
	IBooksList,
	LibraryStatus,
} from '../../../../shared/src'

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

export const bookEntity = {
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
}

export const bookRepository = {
	getByISBN: jest.fn(),
	search: jest.fn(),
	create: jest.fn(),
}

export const bookSearch: IBookSearch = {
	results: [
		{
			_id: '123',
			libraryId: '456',
			title: 'Example Book',
			authors: ['John Doe'],
			description: 'desc',
			language: 'en',
			isbn: [],
			owner: undefined as unknown as IBookSearchResultOwner[],
		},
		{
			_id: '456',
			libraryId: '789',
			title: 'Another Book',
			authors: ['Jane Doe'],
			description: 'desc',
			language: 'en',
			isbn: [],
			owner: undefined as unknown as IBookSearchResultOwner[],
		},
	],
	total: 2,
}

export const booksList: IBooksList = {
	total: 1,
	results: [
		{
			_id: 'aaaaaaaaaaaa',
			authors: ['author'],
			description: 'description',
			place: 'place',
			status: LibraryStatus.TO_LEND,
			title: 'title',
			categories: ['category'],
		},
	],
}

export const book: IBook = {
	_id: '123',
	title: 'Example Book',
	authors: ['John Doe'],
	categories: ['Fiction'],
	description: 'A sample book description.',
	image: {
		thumbnail: 'thumbnail-url',
		smallThumbnail: 'small-thumbnail-url',
	},
	isbn: [
		{
			type: 'ISBN_13',
			identifier: '9781234567890',
		},
	],
	language: 'en',
	subtitle: 'An amazing story',
	publisher: 'Book Publisher',
	publishedDate: '2022-01-01',
	status: LibraryStatus.TO_LEND,
}
