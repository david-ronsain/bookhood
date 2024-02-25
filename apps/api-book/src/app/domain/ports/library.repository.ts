import { IBooksList, ILibraryFull } from '@bookhood/shared'
import LibraryModel from '../models/library.model'

export interface LibraryRepository {
	getByUserIdAndBookId(
		userId: string,
		bookId: string,
	): Promise<LibraryModel | null>

	create(library: LibraryModel): Promise<LibraryModel>

	getByUser(userId: string, page: number): Promise<ILibraryFull[]>

	getById(id: string): Promise<LibraryModel | null>

	getFullById(libraryId: string): Promise<ILibraryFull | null>

	getProfileBooks(userId: string, page: number): Promise<IBooksList>
}
