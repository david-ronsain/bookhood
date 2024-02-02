import LibraryModel from '../models/library.model'

export interface LibraryRepository {
	getByUserIdAndBookId(
		userId: string,
		bookId: string
	): Promise<LibraryModel | null>
	create(library: LibraryModel): Promise<LibraryModel>
}
