/* eslint-disable @nx/enforce-module-boundaries */
import { LibraryStatus, Role } from '../../../shared/src'

export const libraries = Array.from(
	{ length: 15 },
	(value: unknown, index: number) => ({
		_id: `libId#${index}`,
		book: {
			_id: `bookId${index}`,
			title: `title${index}`,
			authors: [`author1-${index}`, `author2-${index}`],
			categories: [`category-${index}`, `category-${index}`],
			description: `desc${index}`,
			image: {
				smallThumbnail: `small${index}`,
				thumbnail: `normal${index}`,
			},
			isbn: [{ type: 'ISBN_13', identifier: `000${index}` }],
			language: 'fr',
			subtitle: `subtitle${index}`,
			publisher: `publisher${index}`,
			publishedDate: '2023',
			status: LibraryStatus.TO_LEND,
		},

		location: {
			type: 'Point',
			coordinates: [0, 0],
		},
		user: {
			_id: `userId#${index}`,
			lastName: `last${index}`,
			firstName: `first${index}`,
			email: `first.last${index}@name.test`,
			role: [Role.USER],
		},
	}),
)
