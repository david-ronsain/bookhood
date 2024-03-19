import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator'
import { Locale } from '../enums'

export class SessionInfos {
	@IsOptional()
	@IsString()
	token?: string

	@IsOptional()
	@IsEnum(Locale)
	locale: Locale.FR
}

export class Session {
	@IsOptional()
	@IsObject()
	session?: SessionInfos
}
