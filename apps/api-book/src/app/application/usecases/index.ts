import AddBookUseCase from './book/addBook.usecase'
import CreateBookIfNewUseCase from './book/createBookIfNew.usecase'
import GetUserBooksUseCase from './book/getUserBooks.usecase'
import GetUserBookUseCase from './book/getUserBook.usecase'
import SearchBookUseCase from './book/searchBook.usecase'
import CreateRequestUseCase from './request/createRequest.usecase'
import GetListByStatusUseCase from './request/getListByStatus.usecase'
import PatchRequestUseCase from './request/patchRequest.usecase'
import GetByIdUseCase from './request/getById.usecase'
import ListUseCase from './library/list.usecase'
import PatchUseCase from './library/patch.usecase'

export const BOOK_USECASES = [
	AddBookUseCase,
	CreateBookIfNewUseCase,
	SearchBookUseCase,
	GetUserBooksUseCase,
	GetUserBookUseCase,
]

export const REQUEST_USECASES = [
	CreateRequestUseCase,
	GetListByStatusUseCase,
	PatchRequestUseCase,
	GetByIdUseCase,
]

export const LIBRARY_USECASES = [ListUseCase, PatchUseCase]
