import { Controller, HttpStatus } from '@nestjs/common'

import { MessagePattern } from '@nestjs/microservices'
import { IBooksList, ILibrary } from '@bookhood/shared'
import {
	GetLibrariesListMQDTO,
	MQLibraryMessageType,
	MicroserviceResponseFormatter,
	PatchLibraryMQDTO,
} from '@bookhood/shared-api'
import ListUseCase from '../usecases/library/list.usecase'
import PatchUseCase from '../usecases/library/patch.usecase'

@Controller()
export class LibraryController {
	constructor(
		private readonly listUseCase: ListUseCase,
		private readonly patchUseCase: PatchUseCase,
	) {}

	@MessagePattern(MQLibraryMessageType.LIST)
	async getLibrariesList(
		body: GetLibrariesListMQDTO,
	): Promise<MicroserviceResponseFormatter<IBooksList>> {
		try {
			const books: IBooksList = await this.listUseCase.handler(
				body.userId,
				body.page,
			)

			return new MicroserviceResponseFormatter<IBooksList>(
				true,
				HttpStatus.OK,
				undefined,
				books,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<IBooksList>().buildFromException(
				err,
				body,
			)
		}
	}

	@MessagePattern(MQLibraryMessageType.PATCH)
	async patch(
		body: PatchLibraryMQDTO,
	): Promise<MicroserviceResponseFormatter<ILibrary>> {
		try {
			const book = await this.patchUseCase.handler(
				body.user._id,
				body.libraryId,
				body.status,
			)

			return new MicroserviceResponseFormatter<ILibrary>(
				true,
				HttpStatus.OK,
				undefined,
				book,
			)
		} catch (err) {
			return new MicroserviceResponseFormatter<ILibrary>().buildFromException(
				err,
				body,
			)
		}
	}
}
