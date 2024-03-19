import { ExecutionContext, Injectable } from '@nestjs/common'
import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n'

@Injectable()
export class MQResolver implements I18nResolver {
	constructor(@I18nResolverOptions() private keys: string[]) {}

	resolve(context: ExecutionContext) {
		let lang: string
		const args = context.getArgs()?.[0]

		for (const key of this.keys) {
			if (args[key]) {
				lang = args[key]
				break
			}
		}

		return lang
	}
}
