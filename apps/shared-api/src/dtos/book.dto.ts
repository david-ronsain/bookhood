import { IAddBookDTO } from '@bookhood/shared'
import { DTOWithAuth } from './common.dto'

export interface AddBookMQDTO extends DTOWithAuth {
	book: IAddBookDTO
}

export interface SearchBookMQDTO extends DTOWithAuth {
	search: string

	startAt: number

	language: string

	boundingBox: number[]
}

export interface GetBookMQDTO extends DTOWithAuth {
	page: number
}

export interface GetStatsMQDTO extends DTOWithAuth {
	userId: string
}
