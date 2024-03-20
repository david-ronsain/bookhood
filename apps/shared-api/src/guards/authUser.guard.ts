import { IUser, Session } from '@bookhood/shared'
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { IncomingMessage } from 'http'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { firstValueFrom } from 'rxjs'
import { Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import { MicroserviceResponseFormatter } from '../formatters'
import { MQUserMessageType } from '../enums'

@Injectable()
export class AuthUserGuard implements CanActivate {
	constructor(
		@Inject('RabbitUser') private readonly userQueue: ClientProxy,
		private readonly i18n: I18nService,
		private readonly configService: ConfigService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		const token = this.extractTokenFromHeader(
			context.switchToHttp().getRequest(),
		)

		if (token) {
			const user = await firstValueFrom<
				MicroserviceResponseFormatter<IUser | null>
			>(this.userQueue.send(MQUserMessageType.GET_BY_TOKEN, token))

			if (!user.success) {
				return Promise.reject(
					new ForbiddenException(
						this.i18n.t('errors.authGuard.forbidden', {
							lang: I18nContext.current()?.lang,
						}),
					),
				)
			}

			request['user'] = {
				roles: user.data.role,
				_id: user.data._id,
				token: user.data.token,
				email: user.data.email,
				firstName: user.data.firstName,
			}
		}

		return Promise.resolve(true)
	}

	private extractTokenFromHeader(
		request: IncomingMessage | Socket | Session,
	): string {
		let token: string[] = []
		if (request instanceof IncomingMessage) {
			token = request?.headers
				? request.headers[
						this.configService.get<string>('settings.sessionToken')
					]
						?.toString()
						.split('|') || []
				: []
		} else if (request instanceof Socket) {
			token = request.handshake
				? request.handshake?.headers[
						this.configService.get<string>('settings.sessionToken')
					]
						.toString()
						.split('|') || []
				: []
		} else if (request.session && request.session.token) {
			token = request.session.token.toString().split('|') || []
		}

		if (token.length === 3) {
			token.pop()
		}

		return token.join('|')
	}
}
