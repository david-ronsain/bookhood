import { Role } from '@bookhood/shared'
import { MicroserviceResponseFormatter } from '@bookhood/shared-api'
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	SetMetadata,
	Inject,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@Inject('RabbitUser') private readonly userQueue: ClientProxy
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const token = this.extractTokenFromHeader(
			context.switchToHttp().getRequest()
		)
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			'roles',
			[context.getHandler(), context.getClass()]
		)
		if (!requiredRoles || requiredRoles.includes(Role.GUEST)) {
			return true
		}
		const roles = await firstValueFrom<Role[]>(
			this.userQueue.send('user-get-role-by-token', token)
		)
		return requiredRoles.some((role) => roles?.includes(role))
	}

	private extractTokenFromHeader(request: Request): string {
		const token: string[] = request.headers['x-token']?.split('|') || []

		if (token.length === 3) {
			token.pop()
		}

		return token.join('|')
	}
}

export const Roles = (roles: Role[]) => SetMetadata('roles', roles)
