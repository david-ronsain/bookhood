import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	Inject,
	LoggerService,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const req = ctx.getRequest<Request>()
		const status = exception.getStatus()

		this.logger.log(
			`${status} ${req.method} ${req.url} - ###{body: ${JSON.stringify(
				req.body
			)}} ###{params: ${JSON.stringify(
				req.params
			)}} ###{query: ${JSON.stringify(req.query)}}`
		)

		response.status(status).json({
			statusCode: status,
			message: exception.message,
		})
	}
}
