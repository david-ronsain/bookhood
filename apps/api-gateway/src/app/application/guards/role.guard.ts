import { Role } from '@bookhood/shared'
import { CurrentUser } from '@bookhood/shared-api'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class RoleGuard implements CanActivate {
	private roles: Role[]

	constructor(roles: Role[] = []) {
		this.roles = roles
	}

	canActivate(context: ExecutionContext): boolean {
		if (this.roles.length === 0 || this.roles.includes(Role.GUEST)) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const user: CurrentUser = request.user

		return this.roles.some((role) => (user?.roles || []).includes(role))
	}
}
