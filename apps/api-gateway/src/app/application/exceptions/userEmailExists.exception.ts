import { ConflictException } from '@nestjs/common'

export class UserEmailExistException extends ConflictException {
	constructor(message: string) {
		super(message)
	}
}
