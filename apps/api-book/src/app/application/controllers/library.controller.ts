import {
	Controller,
	ForbiddenException,
	HttpStatus,
	Inject,
} from '@nestjs/common'

import { ClientProxy, MessagePattern } from '@nestjs/microservices'
import { IUser, IBooksList, ILibrary } from '@bookhood/shared'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import { firstValueFrom } from 'rxjs'
import ListUseCase from '../usecases/library/list.usecase'
import { GetLibrariesListDTO, PatchLibraryDTO } from '../dto/library.dto'
import PatchUseCase from '../usecases/library/patch.usecase'

@Controller()
export class LibraryController {
	constructor(
		@Inject('RabbitUser') private readonly userClient: ClientProxy,
		private readonly listUseCase: ListUseCase,
		private readonly patchUseCase: PatchUseCase,
	) {}

	@MessagePattern('libraries-list')
	async getLibrariesList(
		body: GetLibrariesListDTO,
	): Promise<MicroserviceResponseFormatter<IBooksList>> {
		try {
			await this.checkUserToken(body.token)

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

	@MessagePattern('library-patch')
	async patch(
		body: PatchLibraryDTO,
	): Promise<MicroserviceResponseFormatter<ILibrary>> {
		try {
			const user = await this.checkUserToken(body.token)

			const book = await this.patchUseCase.handler(
				user._id,
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

	private async checkUserToken(requestToken: string): Promise<IUser> {
		const token = requestToken?.split('|') ?? []
		if (token.length === 3) {
			token.pop()
		}

		const userData = await firstValueFrom<
			MicroserviceResponseFormatter<IUser | null>
		>(this.userClient.send('user-get-by-token', token.join('|')))
		if (!userData.success) {
			throw new ForbiddenException()
		}

		return userData.data
	}
}
