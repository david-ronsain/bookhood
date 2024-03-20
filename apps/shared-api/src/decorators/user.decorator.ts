/* eslint-disable @nx/enforce-module-boundaries */
import { CurrentUser } from '@bookhood/shared-api'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): CurrentUser => {
		const request = ctx.switchToHttp().getRequest()
		return request.user
	},
)
