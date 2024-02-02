import { ILibrary } from '@bookhood/shared'
import LibraryModel from '../../domain/models/library.model'
import { LibraryEntity } from '../../infrastructure/adapters/repository/entities/library.entity'

export default class LibraryMapper {
	public static fromEntitytoModel(
		libraryEntity: LibraryEntity
	): LibraryModel {
		return new LibraryModel(libraryEntity)
	}

	public static modelObjectIdToString(library: LibraryModel): ILibrary {
		return {
			...library,
			_id: library._id.toString(),
			userId: library.userId.toString(),
			bookId: library.bookId.toString(),
		} as ILibrary
	}
}
