import {
	IBooksList,
	ILibrary,
	ILibraryFull,
	LibraryStatus,
} from '@bookhood/shared'
import LibraryModel from '../models/library.model'
import { UserLibraryStats } from '@bookhood/shared-api'

export interface LibraryRepository {
	getByUserIdAndBookId(
		userId: string,
		bookId: string,
	): Promise<LibraryModel | null>

	create(library: LibraryModel): Promise<LibraryModel>

	getByUser(userId: string, page: number): Promise<ILibraryFull[]>

	getById(id: string): Promise<LibraryModel | null>

	getFullById(libraryId: string): Promise<ILibraryFull | null>

	list(userId: string, page: number): Promise<IBooksList>

	update(libraryId: string, status: LibraryStatus): Promise<ILibrary>

	getStats(userId: string): Promise<UserLibraryStats | null>
}
