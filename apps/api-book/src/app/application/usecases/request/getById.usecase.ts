import { Inject, NotFoundException } from '@nestjs/common'
import { RequestRepository } from '../../../domain/ports/request.repository'
import { IRequestInfos } from '@bookhood/shared'
import { I18nService } from 'nestjs-i18n'

export default class GetByIdUseCase {
	constructor(
		@Inject('RequestRepository')
		private readonly requestRepository: RequestRepository,
		private readonly i18n: I18nService,
	) {}

	async handler(requestId: string): Promise<IRequestInfos | null> {
		const request = await this.requestRepository.getRequestInfos(requestId)
		if (!request) {
			throw new NotFoundException(
				this.i18n.t('errors.request.getById.notFound'),
			)
		}

		return request
	}
}
