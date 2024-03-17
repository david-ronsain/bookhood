/* eslint-disable @nx/enforce-module-boundaries */
import mongoose from 'mongoose'
import {
	IBooksList,
	ILibrary,
	ILibraryFull,
	LibraryStatus,
} from '../../../../shared/src'
import { UserLibraryStats } from '../../../src'

export const userLibraryStats: UserLibraryStats = {
	nbBooks: 3,
	nbPlaces: 2,
	nbBooksToGive: 2,
	nbBooksToLend: 5,
}

export const libraryFull: ILibraryFull = {
	book: {
		title: 'Title',
		authors: ['author'],
		description: 'desc',
		isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
		language: 'fr',
	},
	location: {
		type: 'Point',
		coordinates: [0, 0],
	},
	user: {
		firstName: 'first',
		lastName: 'last',
		email: 'first.last@name.test',
	},
}

export const library: ILibrary = {
	bookId: 'bookId',
	location: {
		type: 'Point',
		coordinates: [0, 0],
	},
	place: 'somePlace',
	status: LibraryStatus.TO_GIVE,
	userId: 'userId',
}

export const libraryEntity = {
	userId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
	bookId: 'cccccccccccccccccccccccc',
	location: {
		type: 'Point',
		coordinates: [0, 0],
	},
	status: LibraryStatus.TO_LEND,
	place: 'Some place',
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

export const librariesFull: ILibraryFull[] = [
	{
		_id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
		book: {
			_id: 'bbbbbbbbbbbbbbbbbbbbbbbb',
			title: 'Title',
			authors: ['author'],
			isbn: [{ type: 'ISBN_13', identifier: '0123456789123' }],
			description: 'desc',
			language: 'fr',
		},
		location: {
			type: 'Point',
			coordinates: [0, 0],
		},
		user: {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		},
	},
	{
		_id: 'cccccccccccccccccccccccc',
		book: {
			_id: 'dddddddddddddddddddddddd',
			title: 'Title',
			authors: ['author'],
			isbn: [{ type: 'ISBN_13', identifier: '1234567890123' }],
			description: 'desc',
			language: 'fr',
		},
		location: {
			type: 'Point',
			coordinates: [0, 0],
		},
		user: {
			firstName: 'first',
			lastName: 'last',
			email: 'first.last@name.test',
		},
	},
]

export const libraryModel = {
	_id: new mongoose.Types.ObjectId(),
	userId: new mongoose.Types.ObjectId(),
	bookId: new mongoose.Types.ObjectId(),
	location: { type: 'Point', coordinates: [0, 0] },
}
