import {
	ConflictException,
	ForbiddenException,
	HttpStatus,
	NotFoundException,
} from '@nestjs/common'

export class MicroserviceResponseFormatter<T> {
	readonly success: boolean
	readonly code: HttpStatus
	readonly payload: unknown
	readonly message: string
	readonly data: T

	constructor(
		success?: boolean,
		code?: HttpStatus,
		payload?: unknown,
		data?: T,
		message?: string
	) {
		this.success = !!success

		if (code) {
			this.code = code
		}

		if (payload) {
			this.payload = payload
		}

		if (data) {
			this.data = data
		}

		if (message) {
			this.message = message
		}
	}

	buildFromException(
		err: unknown,
		payload: unknown
	): MicroserviceResponseFormatter<T> {
		if (
			err instanceof ConflictException ||
			err instanceof ForbiddenException ||
			err instanceof NotFoundException
		)
			return new MicroserviceResponseFormatter<T>(
				false,
				err.getStatus(),
				payload,
				undefined,
				err.message
			)
		else return new MicroserviceResponseFormatter<T>(false, 500, payload)
	}
}
