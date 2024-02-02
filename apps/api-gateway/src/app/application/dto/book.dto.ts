import { IAddBookDTO, type IBookImageLinks, IISBN } from '@bookhood/shared'
import { ApiProperty } from '@nestjs/swagger'
import {
	IsNotEmpty,
	IsString,
	IsArray,
	IsOptional,
	ArrayMinSize,
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
}
