/* eslint-disable @nx/enforce-module-boundaries */
import { Test, TestingModule } from '@nestjs/testing'
import SearchBookUseCase from '../../../../../src/app/application/usecases/book/searchBook.usecase'
import { BookRepository } from '../../../../../src/app/domain/ports/book.repository'
import { bookRepository, bookSearch } from '../../../../../../shared-api/test'

describe('SearchBookUseCase', () => {
	let searchBookUseCase: SearchBookUseCase
	let bookRepositoryMock: BookRepository

	beforeEach(async () => {
		jest.clearAllMocks()
		bookRepositoryMock = bookRepository

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

		const expectedResult = bookSearch

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
