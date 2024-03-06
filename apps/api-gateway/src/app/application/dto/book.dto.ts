import {
	IAddBookDTO,
	type IBookImageLinks,
	IISBN,
	type ICoords,
	LibraryStatus,
	type IBookSearch,
	IBookSearchResult,
	IBook,
} from '@bookhood/shared'
import { ApiProperty } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsString,
	IsArray,
	IsOptional,
	ArrayMinSize,
	IsEnum,
	IsNumber,
} from 'class-validator'

export class AddBookDTO implements IAddBookDTO {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	title: string

	@ApiProperty()
	@IsNotEmpty()
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	authors: string[]

	@ApiProperty()
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	categories: string[]

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	description: string

	@IsOptional()
	image?: IBookImageLinks
	isbn: IISBN[]

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	language: string

	@ApiProperty()
	@IsOptional()
	@IsString()
	subtitle: string

	@ApiProperty()
	@IsOptional()
	@IsString()
	publisher: string

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	publishedDate: string

	@ApiProperty()
	@IsNotEmpty()
	location: ICoords

	@ApiProperty()
	@IsNotEmpty()
	@IsEnum(LibraryStatus)
	status: LibraryStatus

	@ApiProperty()
	@IsNotEmpty()
	place: string
}

export class BookSearchDTO {
	@ApiProperty()
	@IsString()
	q: string

	@ApiProperty()
	@IsNumber()
	startIndex: number

	@ApiProperty()
	@IsArray()
	boundingBox: number[]
}

export class BookSearch implements IBookSearch {
	results: IBookSearchResult[]

	total: number
}

export class Book implements IBook {
	_id?: string

	title: string

	authors: string[]

	categories?: string[]

	description: string

	image?: IBookImageLinks

	isbn: IISBN[]

	language: string

	subtitle?: string

	publisher?: string

	publishedDate?: string

	status?: LibraryStatus
}
