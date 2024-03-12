import { IUser } from '@bookhood/shared'
import {
	MQUserMessageType,
	MicroserviceResponseFormatter,
} from '@bookhood/shared-api'
import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { IncomingMessage } from 'http'
import { firstValueFrom } from 'rxjs'
import { Socket } from 'socket.io'

@Injectable()
export class AuthUserGuard implements CanActivate {
	constructor(
		@Inject('RabbitUser') private readonly userQueue: ClientProxy,
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
					new ForbiddenException('User not logged in'),
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

	private extractTokenFromHeader(request: IncomingMessage | Socket): string {
		let token: string[] = []
		if (request instanceof IncomingMessage) {
			token = request?.headers
				? request.headers['x-token']?.toString().split('|') || []
				: []
		} else if (request instanceof Socket) {
			token = request.handshake
				? request.handshake?.headers['x-token'].toString().split('|') ||
					[]
				: []
		}

		if (token.length === 3) {
			token.pop()
		}

		return token.join('|')
	}
}
