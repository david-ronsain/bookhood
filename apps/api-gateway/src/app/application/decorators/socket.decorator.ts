import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import envConfig from '../../../config/env.config'
import { Socket } from 'socket.io'
import { Locale } from '@bookhood/shared'

export const SocketHeaders = createParamDecorator(
	(header: string, ctx: ExecutionContext): unknown => {
		const socket: Socket = ctx.getArgByIndex(0)

		if (socket) {
			switch (header) {
				case envConfig().i18n.localeToken:
					return (
						(socket?.handshake?.headers?.[
							header
						]?.toString() as Locale) ?? Locale.FR
					)

				case envConfig().settings.sessionToken:
					return (
						socket?.handshake?.headers?.[header]?.toString() ?? ''
					)
			}
		}

		return undefined
	},
)
