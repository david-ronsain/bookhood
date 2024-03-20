import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	Inject,
	LoggerService,
	HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
	) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const req = ctx.getRequest<Request>()
		const status = exception.getStatus()

		this.logger.log(
			`${status} ${req.method} ${req.url} - ###{body: ${JSON.stringify(
				req.body,
			)}} ###{params: ${JSON.stringify(
				req.params,
			)}} ###{query: ${JSON.stringify(req.query)}}`,
		)
		let reasons
		if (status === HttpStatus.BAD_REQUEST) {
			reasons =
				typeof exception.getResponse() === 'object'
					? exception.getResponse()
					: JSON.parse(exception.getResponse().toString())
		}

		response.status(status).json({
			statusCode: status,
			message: exception.message,
			reasons:
				status === HttpStatus.BAD_REQUEST
					? reasons?.message
					: undefined,
		})
	}
}
