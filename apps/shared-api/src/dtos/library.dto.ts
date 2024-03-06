import { LibraryStatus } from '@bookhood/shared'
import { DTOWithAuth } from './common.dto'

export interface GetLibrariesListMQDTO extends DTOWithAuth {
	userId: string

	page: number
}

export interface PatchLibraryMQDTO extends DTOWithAuth {
	libraryId: string

	status: LibraryStatus
}
