/* eslint-disable @nx/enforce-module-boundaries */
import {
	IBookSearch,
	IBookSearchResultOwner,
} from '../../../../../../shared/src'
import { Test, TestingModule } from '@nestjs/testing'
import SearchBookUseCase from '../../../../../src/app/application/usecases/book/searchBook.usecase'
import { BookRepository } from '../../../../../src/app/domain/ports/book.repository'

describe('SearchBookUseCase', () => {
	let searchBookUseCase: SearchBookUseCase
	let bookRepositoryMock: BookRepository

	beforeEach(async () => {
		bookRepositoryMock = {
			search: jest.fn(),
			getByISBN: jest.fn(),
			create: jest.fn(),
		}

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SearchBookUseCase,
				{
					provide: 'BookRepository',
					useValue: bookRepositoryMock,
				},
			],
		}).compile()

		searchBookUseCase = module.get<SearchBookUseCase>(SearchBookUseCase)
	})

	it('should search books and return the result', async () => {
		const search = 'intitle:Example'
		const startAt = 0
		const language = 'en'
		const boundingBox = [0, 0, 10, 10]

		const expectedResult: IBookSearch = {
			results: [
				{
					_id: '123',
					libraryId: '456',
					title: 'Example Book',
					authors: ['John Doe'],
					description: 'desc',
					language: 'en',
					isbn: [],
					owner: undefined as unknown as IBookSearchResultOwner[],
				},
				{
					_id: '456',
					libraryId: '789',
					title: 'Another Book',
					authors: ['Jane Doe'],
					description: 'desc',
					language: 'en',
					isbn: [],
					owner: undefined as unknown as IBookSearchResultOwner[],
				},
			],
			total: 2,
		}

		jest.spyOn(bookRepositoryMock, 'search').mockResolvedValue(
			expectedResult,
		)

		const result = await searchBookUseCase.handler(
			search,
			startAt,
			language,
			boundingBox,
			'first.last@name.test',
		)

		expect(bookRepositoryMock.search).toHaveBeenCalledWith(
			'intitle',
			'Example',
			startAt,
			language,
			boundingBox,
			'first.last@name.test',
		)

		expect(result).toEqual(expectedResult)
	})
})
