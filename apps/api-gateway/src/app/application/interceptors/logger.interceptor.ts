import {
	CallHandler,
	ExecutionContext,
	Inject,
	Injectable,
	LoggerService,
	NestInterceptor,
} from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import { Observable } from 'rxjs'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<unknown>
	): Observable<unknown> | Promise<Observable<unknown>> {
		const req = context.switchToHttp().getRequest()

		this.logger.log(
			`${context.switchToHttp().getResponse().statusCode} ${req.method} ${
				req.url
			} - ###{body: ${JSON.stringify(
				req.body
			)}} ###{params: ${JSON.stringify(
				req.params
			)}} ###{query: ${JSON.stringify(req.query)}}`
		)

		return next.handle()
	}
}
